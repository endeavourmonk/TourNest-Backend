const express = require('express');

const {
  signUp,
  login,
  protect,
  restrictToRole,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth');
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe,
  changeRole,
  myProfile,
} = require('../controllers/users');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);
router.get('/my-profile', protect, myProfile);
router.get('/:id', getUser);
router.get('/', getAllUsers);

router.patch('/:id', protect, restrictToRole('admin'), updateUser);
router.delete('/:id', protect, restrictToRole('admin'), deleteUser);
router.patch('/change-role/:id', protect, restrictToRole('admin'), changeRole);

module.exports = router;
