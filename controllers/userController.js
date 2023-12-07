const User = require('../models/users');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: '✅ success',
      results: users.length,
      data: {
        users: users,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const id = { req };
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError(404, `No User found with id: ${id}`));
    }
    res.status(200).json({
      status: '✅ success',
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.updateUser = async (req, res, next) => {};
exports.deleteUser = async (req, res, next) => {};
