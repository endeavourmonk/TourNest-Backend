const express = require('express');
const { signUp, login, protect } = require('../controllers/auth');
const {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  forgotPassword,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.route('/').get(protect, getAllUsers);
router.route('/forgotpassword').post(forgotPassword);
// router.route('/resetpassword').post(resetPassword);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
