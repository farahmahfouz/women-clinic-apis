const { Router } = require('express');
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
} = require('../controllers/userController');
const { auth, protectTo } = require('../middlewares/authMiddlerware');
const { login, signup } = require('../controllers/authController');

const router = Router();

// ---------- Public Routes ----------
router.post('/signup', signup);
router.post('/login', login);

// ---------- Protected Routes ----------
router.use(auth);

router.get('/me', getMe, getOneUser);
router.patch('/updateMe', updateMe);

router.use(protectTo('admin'));

router.get('/', getUsers);

router.get('/:id', getOneUser);

router.post('/', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
