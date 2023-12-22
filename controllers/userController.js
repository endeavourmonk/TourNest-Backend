const User = require('../models/users');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const filterObj = (obj, allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filteredObj[key] = obj[key];
  });
  return filteredObj;
};

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

/*  later email should be updated by asking for the current password
    and getting verified from the new email
*/
exports.updateMe = async (req, res, next) => {
  try {
    // Don't let user to update password through this route
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(400, 'Password cannot be updated through this route'),
      );

    // Update the user data
    const fieldsToKeep = ['name', 'email', 'photo'];
    const filteredBody = filterObj(req.body, fieldsToKeep);

    const { id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Not delete the user from db, mark user inactive
exports.deleteMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { active: false });

    res.status(204).json({
      status: '✅ success',
      message: 'Deleted User',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
