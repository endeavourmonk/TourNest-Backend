const User = require('../models/users');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');

const filterObj = (obj, allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filteredObj[key] = obj[key];
  });
  return filteredObj;
};

exports.getAllUsers = handleAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.getUser = handleAsync(async (req, res, next) => {
  const id = { req };
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError(404, `No User found with id: ${id}`));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.updateUser = async (req, res, next) => {};
exports.deleteUser = async (req, res, next) => {};

/*  later email should be updated by asking for the current password
    and getting verified from the new email
*/
exports.updateMe = handleAsync(async (req, res, next) => {
  // Don't let user to update password through this route
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(400, 'Password cannot be updated through this route'),
    );

  // Update the user data
  const fieldsToKeep = ['name', 'email', 'photo', 'username'];
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
});

// Not delete the user from db, mark user inactive
exports.deleteMe = handleAsync(async (req, res, next) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'Deleted User',
    data: null,
  });
});

exports.changeRole = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = { role: req.body.role };
  const updatedUser = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
