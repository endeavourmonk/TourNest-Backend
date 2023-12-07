const jwt = require('jsonwebtoken');
const User = require('../models/users');
const AppError = require('../utils/appError');

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
    const isPasswordChanged = user.passwordChangedAfterToken(decoded.iat);
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
