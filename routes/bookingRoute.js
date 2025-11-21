const express = require('express');
const {
  getAllBookings,
  getOneBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  setBookingIds,
  getMonthlyBookings,
  getMostBookedServices
} = require('../controllers/bookingController');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = express.Router({ mergeParams: true });

router.use(auth);

router.get('/monthly-booking/:year', protectTo('admin'), getMonthlyBookings);
router.get('/stats/most-booked-services', getMostBookedServices);

router.get('/', getAllBookings);
router.get('/:id', getOneBooking);

router.post(
  '/',
  protectTo('patient', 'employee', 'admin'),
  setBookingIds,
  createBooking
);

router.patch('/:id', updateBooking);
router.delete('/:id', cancelBooking);

module.exports = router;
