const express = require('express');
const router = express.Router();
const { getProfile, adminOnly } = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/profile', verifyToken, getProfile);
router.get('/admin', verifyToken, authorizeRole(['ADMIN']), adminOnly);

module.exports = router;
