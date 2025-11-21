const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

exports.createBooking = async (data) => {
  const { doctor, dateOfService, timeSlot } = data;

  await Booking.validateDoctorAvailability(doctor, dateOfService, timeSlot);

  // Check for existing bookings to prevent double-booking at the same time
  const conflict = await Booking.findOne({
    doctor,
    dateOfService,
    'timeSlot.start': timeSlot.start,
  });
  if (conflict) throw new AppError('Doctor already booked at this time', 400);

  const booking = await Booking.create(data);

  return booking;
};

exports.getAllBookings = async (filter) => {
  const bookings = await Booking.find(filter);
  return bookings;
};

exports.getOneBooking = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};

exports.updateBooking = async (id, updates) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError('Booking not found', 404);

  if (updates.user || updates.doctor) {
    throw new AppError('Cannot change doctor or user for a booking', 400);
  }

  const newDate = updates.dateOfService || booking.dateOfService;
  const newTime = updates.timeSlot || booking.timeSlot;

  await Booking.validateDoctorAvailability(booking.doctor, newDate, newTime);

  const conflict = await Booking.findOne({
    doctor: booking.doctor,
    dateOfService: newDate,
    'timeSlot.start': newTime.start,
    _id: { $ne: id },
  });

  if (conflict) throw new AppError('Doctor already booked at this time', 400);

  // Apply updates
  Object.assign(booking, updates);

  await booking.save();
  return booking;
};

exports.cancelBooking = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError('Booking not found', 404);

  booking.status = 'cancelled';
  await booking.save();

  return booking;
};

exports.getMonthlyBooking = async (year) => {
  const stats = Booking.aggregate([
    {
      $match: {
        dateOfService: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$dateOfService' },
        numBookings: { $sum: 1 },
        doctorsSet: { $addToSet: '$doctor' },
        patientsSet: { $addToSet: '$user' },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $addFields: {
        monthNumber: '$_id',
        numDoctors: { $size: '$doctorsSet' },
        numPatients: { $size: '$patientsSet' },
      },
    },
    {
      $project: {
        _id: 0,
        monthNumber: 1,
        numBookings: 1,
        totalRevenue: 1,
        numDoctors: 1,
        numPatients: 1,
      },
    },
    { $sort: { numBookings: -1 } },
  ]);
  return stats;
};


exports.getMostBookedServices = async (req, res) => {
  const stats = await Booking.aggregate([
    { $unwind: "$services" },

    {
      $group: {
        _id: "$services.serviceOption",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$services.price" }
      }
    },

    // 1️⃣ Lookup to get ServiceOption data
    {
      $lookup: {
        from: "serviceoptions",
        let: { optionId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$optionId"] }
            }
          }
        ],
        as: "serviceOptionInfo"
      }
    },
    { $unwind: "$serviceOptionInfo" },

    // 2️⃣ Lookup to get the actual Service name
    {
      $lookup: {
        from: "services",
        let: { serviceId: "$serviceOptionInfo.service" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$serviceId"] }
            }
          }
        ],
        as: "serviceInfo"
      }
    },
    { $unwind: "$serviceInfo" },

    {
      $project: {
        _id: 0,
        optionName: "$serviceOptionInfo.optionName",
        serviceName: "$serviceInfo.name", 
        type: "$serviceOptionInfo.type",
        price: "$serviceOptionInfo.price",
        count: 1,
        totalRevenue: 1
      }
    },

    { $sort: { count: -1 } }
  ]);
  return stats
};
