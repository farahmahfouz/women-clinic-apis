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
const { login, signup, forgotPassword, resetPassword } = require('../controllers/authController');
const bookingRouter = require('./bookingRoute');

const router = Router();

router.use('/:patientId/patient-bookings', bookingRouter);
router.use('/:doctorId/bookings', bookingRouter);

// ---------- Public Routes ----------
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

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
