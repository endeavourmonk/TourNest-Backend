const express = require('express');
const { baseController } = require('../controllers/base');

const router = express.Router();

router.get('/api', baseController);
router.get('/', baseController);

module.exports = router;
