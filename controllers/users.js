const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const User = require('../models/users');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');
const uploader = require('../utils/cloudinary');
const { getAll, getOne, updateOne, deleteOne } = require('./handleFactory');

// Multer configuration: Accept single image file in buffer then resizing and saving
// in disk, then putting the local path in the req, then uploading that file on cloudinary
// and finally unlinking the file from the local disk.
const storage = multer.memoryStorage();

const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(400, `Uploaded file is not an image.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFileFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = handleAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  req.localFilePath = `tmp/${filename}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(req.localFilePath);

  next();
});

exports.uploadToCloudinary = async (req, res, next) => {
  if (!req.file) if (!req.file) return next();

  // upload file to user-profile folder in cloudinary.
  const folder = 'tournest/users';
  const { localFilePath } = req;
  try {
    const result = await uploader(folder, localFilePath);
    req.file.publicUrl = result.secure_url;

    // remove the local file after uploading to cloudinary.
    fs.unlink(localFilePath, (err) => {
      if (err) throw err;
      next();
    });
  } catch (error) {
    return next(new AppError(500, `Error Uploading file to cloudinary.`));
  }
};

const filterObj = (obj, allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filteredObj[key] = obj[key];
  });
  return filteredObj;
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

exports.myProfile = (req, res, next) => {
  const { user } = req;
  res.status(200).json({
    data: user,
  });
};

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
  if (req.file) filteredBody.photo = req.file.publicUrl;

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
