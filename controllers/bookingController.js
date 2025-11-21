const BookingService = require('../services/bookingService');
const catchAsync = require('../utils/catchAsync');

exports.setBookingIds = (req, res, next) => {
  //   if (!req.body.service) req.body.service = req.params.serviceId;
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createBooking = catchAsync(async (req, res) => {
  const booking = await BookingService.createBooking(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Booking created successfully',
    data: { booking },
  });
});

// user/doctorId/bookings
exports.getAllBookings = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.doctorId) filter = { doctor: req.params.doctorId };
  if (req.params.patientId) filter = { user: req.params.patientId };
  const bookings = await BookingService.getAllBookings(filter);

  res.status(200).json({
    status: 'success',
    message: 'Bookings retrieved successfully',
    results: bookings.length,
    data: { bookings },
  });
});

exports.getOneBooking = catchAsync(async (req, res) => {
  const booking = await BookingService.getOneBooking(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Booking retrieved successfully',
    data: { booking },
  });
});

exports.updateBooking = catchAsync(async (req, res) => {
  const booking = await BookingService.updateBooking(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Booking updated Successfully',
    data: { booking },
  });
});

exports.cancelBooking = catchAsync(async (req, res) => {
  const Booking = await BookingService.cancelBooking(req.params.id);
  res.status(204).json({
    status: 'success',
    message: 'Booking deleted successfully',
    data: { Booking },
  });
});

exports.getMonthlyBookings = async (req, res) => {
  const year = req.params.year * 1;

  const stats = await BookingService.getMonthlyBooking(year);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
};


exports.getMostBookedServices = async (req, res) => {
  const stats = await BookingService.getMostBookedServices();
  
  res.status(200).json({
    status: "success",
    results: stats.length,
    data: stats
  });
};
