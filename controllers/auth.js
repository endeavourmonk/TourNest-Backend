const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/users');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: '✅ success',
      message: 'Signed Up successfully',
      token: token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // if empty email or password
    if (!email || !password) {
      return next(new AppError(400, 'Enter email and password'));
    }

    const user = await User.findOne({ email });
    // if no user exist with this email
    if (!user) {
      return next(new AppError(404, `User doesn't exist`));
    }

    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password,
    );

    // return response based on the entered password is correct or not
    if (isPasswordCorrect) {
      const token = signToken(user._id);

      res.status(201).json({
        status: '✅ success',
        message: 'LoggedIn successfully',
        token: token,
      });
    } else {
      return next(new AppError(400, `Wrong Password`));
    }
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Empty token: user not logged In
    if (!token) {
      return next(new AppError(401, 'Login to access this route'));
    }

    // Verify token
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) return next(new AppError(404, `User doesn't exist`));

    // Check if password changed after issuing token
    const isPasswordChanged = user.hasPasswordChangedSinceToken(decoded.iat);
    if (isPasswordChanged)
      return next(new AppError(401, 'Password changed, Please login again!'));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.restrictToRole =
  (...roles) =>
  (req, res, next) => {
    const permission = roles.includes(req.user.role);
    if (!permission)
      return next(
        new AppError(403, 'You do not have permission to perform this action'),
      );
    next();
  };

exports.forgotPassword = async (req, res, next) => {
  // Get the email
  const { email } = req.body;
  if (!email) return next(new AppError(400, 'Please Enter Email'));

  // Check if user exists with this email
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(404, 'No user exists with this email'));

  // Generate password reset token and save in db
  const passwordResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send token to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/reset-password/${passwordResetToken}`;
    const message = `Forgot your password?\nSubmit a patch request to ${resetURL} with new password and password Confirm.\nIf you didn't forgot password, Please Ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token. Valid for 10 mins',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: `Token sent to ${user.email}`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(500, 'Some error occured. Please try again later!'),
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm)
      return next(
        new AppError(400, 'Please Enter password and Password Confirm'),
      );

    // Get the user based on the token
    const { token } = req.params;
    const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');

    // If user exists and token is not expired, change the passowrd
    const user = await User.findOne({ passwordResetToken: hashedtoken });
    if (!user) return next(new AppError(400, 'Invalid password reset token'));

    if (user.passwordResetTokenExpires < Date.now())
      return next(
        new AppError(400, 'Password reset timed out, Please try again'),
      );

    /*  Update the passwordLastChanged and password property and 
        set tokens field to undefined so that user cannot update
        password again with the same token.
    */
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();

    // Login user, send JWT
    const jwtToken = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token: jwtToken,
    });
  } catch (error) {
    next(error);
  }
};
