const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    daysOff: [
      {
        type: String,
        enum: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
    ],
    availability: [
      {
        day: {
          type: String,
          enum: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          required: true,
        },
        slots: [
          {
            start: { type: String, match: /^\d{2}:\d{2}$/ },
            end: { type: String, match: /^\d{2}:\d{2}$/ },
          },
        ],
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorScheduleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'doctor',
    select: 'name',
  });
  next();
});

const DoctorSchedual = mongoose.model('DoctorSchedual', doctorScheduleSchema);
module.exports = DoctorSchedual;
