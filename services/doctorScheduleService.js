const DoctorSchedule = require('../models/doctorScheduleModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllDrSchedule = async () => {
  const schedule = await DoctorSchedule.find();
  return schedule;
};

exports.getDrSchedule = async (doctorId) => {
  const schedule = await DoctorSchedule.findOne({ doctor: doctorId });

  if (!schedule) throw new AppError('Doctor schedule not found', 404);

  return schedule;
};

exports.createDrSchedule = async (data) => {
  const doctor = await User.findById(data.doctor);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const existDrScheduale = await DoctorSchedule.findOne({
    doctor: data.doctor,
  });
  if (existDrScheduale)
    throw new AppError('Schedule already exists for this doctor', 400);

  if (data.availability) {
    data.availability.forEach((dayObj) => {
      dayObj.slots.forEach((slot) => {
        if (slot.start >= slot.end)
          throw new AppError(
            `Invalid time slot (${slot.start} >= ${slot.end})`,
            400
          );
      });
    });
  }
  const schedule = await DoctorSchedule.create(data);
  return schedule;
};

exports.updateDrSchedule = async (id, data) => {
  if (data.availability) {
    data.availability.forEach((dayObj) => {
      dayObj.slots.forEach((slot) => {
        if (slot.start >= slot.end)
          throw new AppError(
            `Invalid time slot (${slot.start} >= ${slot.end})`,
            400
          );
      });
    });
  }

  const existingSchedule = await DoctorSchedule.findById(id);
  if (!existingSchedule) throw new AppError('Scheduale not found', 404);

  const doctorId = data.doctor || existingSchedule.doctor;

  const doctor = await User.findById(doctorId);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const schedule = await DoctorSchedule.findByIdAndUpdate(
    id,
    { ...data, doctor: doctorId },
    {
      new: true,
      runValidators: true,
    }
  );

  return schedule;
};

exports.deleteSchedule = async (id) => {
  const schedule = await DoctorSchedule.findByIdAndDelete(id);
  if (!schedule) throw new AppError('Scheduale not found', 404);
};
