const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const DoctorSchedule = require('./doctorScheduleModel');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    services: [
      {
        serviceOption: {
          type: mongoose.Schema.ObjectId,
          ref: 'ServiceOption',
          required: true,
        },
        price: {
          type: Number,
          required: true,
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    dateOfService: {
      type: Date,
      required: true,
    },

    timeSlot: {
      start: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      },
      end: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      }
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    notes: String,
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate('user', 'name')
    .populate('doctor', 'name')
    .populate('services.serviceOption', 'optionName price type');
  next();
});


bookingSchema.statics.validateDoctorAvailability = async function (
  doctorId,
  newDate,
  newTime
) {
  const schedule = await DoctorSchedule.findOne({ doctor: doctorId });
  if (!schedule) throw new AppError('Doctor schedule not found', 404);

  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    new Date(newDate).getDay()
  ];

  if (schedule.daysOff.includes(dayName))
    throw new AppError('Doctor is off on this day', 400);

  const dayAvailability = schedule.availability.find((a) => a.day === dayName);
  if (!dayAvailability)
    throw new AppError('Doctor is not available on this day', 400);

  const isValidTime = dayAvailability.slots.some(
    (slot) => newTime.start >= slot.start && newTime.end <= slot.end
  );

  if (!isValidTime)
    throw new AppError("Selected time is outside doctor's working hours", 400);

  return true;
};


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;