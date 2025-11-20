const { Router } = require('express');
const {
  getAllDoctorSchedules,
  getDoctorSchedule,
  createDoctorSchedule,
  updateDoctorSchedule,
  deleteDoctorSchedule,
} = require('../controllers/doctorScheduleController');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router();

// ---------- Public Routes ----------
router.get('/', getAllDoctorSchedules);
router.get('/:id', getDoctorSchedule);

// ---------- Protected Routes ----------
router.use(auth);

router.post('/', protectTo('admin'), createDoctorSchedule);
router.patch('/:id', protectTo('admin'), updateDoctorSchedule);
router.delete('/:id', protectTo('admin'), deleteDoctorSchedule);

module.exports = router;

