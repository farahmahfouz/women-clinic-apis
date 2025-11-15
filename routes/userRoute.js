const { Router } = require('express');
const { getUsers } = require('../controllers/userController');
const { auth, protectTo } = require('../middlewares/authMiddlerware');
const { login, signup } = require('../controllers/authController');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(auth, protectTo('admin'));

router.get('/', getUsers);

module.exports = router;
