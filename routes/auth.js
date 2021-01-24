const router = require('express').Router();
const auth = require('../app/middleware/Authenticate');
const AuthController = require('../app/controllers/AuthController');

router.get('/user', auth, AuthController.user);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', auth, AuthController.logout);

module.exports = router;
