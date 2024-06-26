const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/users');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const handleAsync = require('../utils/handleAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token: token,
    user: user,
  });
};

// TODO: send verify email before creating accound
exports.signUp = handleAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Don't put extra fields for security reasons
    const newUser = await User.create(
      [
        {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
        },
      ],
      { session },
    );

    // Send Welcome email
    const _email = new Email(newUser[0]);
    await _email.sendWelcome();

    // If everything is successful, commit the transaction
    await session.commitTransaction();
    session.endSession();

    createAndSendToken(newUser, 201, res);
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    return next(new AppError(500, `Error signing up. ${error}`));
  }
});

exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Enter email and password'));
  }

  const user = await User.findOne({ email });
  // if no user exist with this email
  if (!user) {
    return next(new AppError(404, `User doesn't exist`));
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password);

  // return response based on the entered password is correct or not
  if (isPasswordCorrect) {
    createAndSendToken(user, 201, res);
  } else {
    return next(new AppError(400, `Wrong Password`));
  }
});

exports.protect = handleAsync(async (req, res, next) => {
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
});

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
  try {
    // Generate password reset token and save in db
    const passwordResetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send token to user's email, User will submit a PATCH request to resetURL
    // with new password and passwordConfirm.
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/reset-password/${passwordResetToken}`;

    const _email = new Email(user, resetURL);
    await _email.sendPasswordReset();

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

exports.resetPassword = handleAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm)
    return next(
      new AppError(400, 'Please Enter password and Password Confirm'),
    );

  // Get the user based on the token
  const { resetToken } = req.params;
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // If user exists and token is not expired, change the passowrd
  const user = await User.findOne({ passwordResetToken: hashedResetToken });
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
  createAndSendToken(user, 200, res);
});

exports.updatePassword = handleAsync(async (req, res, next) => {
  const { password, newPassword, passwordConfirm } = req.body;
  const { id } = req.user;

  if (!password && !newPassword && !passwordConfirm)
    return next(
      new AppError(
        400,
        'Please enter current pasword, new password and confirm new passowrd',
      ),
    );

  // Get the user
  const user = await User.findOne({ _id: id });
  if (!user) return next(new AppError(404, 'user does not exist'));

  // Check if entered password is correct
  const isPasswordCorrect = await user.comparePassword(password, user.password);

  if (!isPasswordCorrect)
    return next(new AppError(400, 'Wrong Current password, Please try again'));

  // Update the password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // Login user
  createAndSendToken(user, 200, res);
});
