const express = require('express');

const {
  signUp,
  login,
  protect,
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
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-user', protect, deleteMe);

router.route('/').get(protect, getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
