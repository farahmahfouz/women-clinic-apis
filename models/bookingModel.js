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
        },
      },
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
      slotId: {
        type: mongoose.Schema.ObjectId,
        required: true,
      },
      start: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      },
      end: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },

    notes: String,
  },
  { timestamps: true }
);

bookingSchema.index(
  {
    doctor: 1,
    dateOfService: 1,
    'timeSlot.start': 1,
    'timeSlot.end': 1,
  },
  { unique: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate('user', 'name phone')
    .populate('doctor', 'name')
    .populate('services.serviceOption', 'optionName price type');
  next();
});

bookingSchema.post('save', async function () {
  if (this.timeSlot?.slotId) {
    await DoctorSchedule.updateOne(
      { 'availability.slots._id': this.timeSlot.slotId },
      { $set: { 'availability.$[].slots.$[slot].isBooked': true } },
      { arrayFilters: [{ 'slot._id': this.timeSlot.slotId }] }
    );
  }
});

bookingSchema.post('findOneAndUpdate', async function () {
  const booking = await this.model.findOne(this.getQuery());

  if (booking?.status === 'cancelled' && booking.timeSlot?.slotId) {
    await DoctorSchedule.updateOne(
      { 'availability.slots._id': booking.timeSlot.slotId },
      { $set: { 'availability.$[].slots.$[slot].isBooked': false } },
      { arrayFilters: [{ 'slot._id': booking.timeSlot.slotId }] }
    );
  }
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

  const slot = dayAvailability.slots.find(
    (s) => s._id.toString() === newTime.slotId.toString()
  );

  if (!slot) throw new AppError('Selected time slot not found', 400);

  if (slot.isBooked)
    throw new AppError('This time slot is already booked', 400);

  return true;
};

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
