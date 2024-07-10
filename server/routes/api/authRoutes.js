const router = require('express').Router();
const { signup, login, logout } = require('../../controllers/authController');
const { authMiddleware } = require('../../utils/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;