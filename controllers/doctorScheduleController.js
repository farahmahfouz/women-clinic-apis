const DoctorScheduleService = require('../services/doctorScheduleService');
const catchAsync = require('../utils/catchAsync');

exports.getAllDoctorSchedules = catchAsync(async (req, res, next) => {
  const schedules = await DoctorScheduleService.getAllDrSchedule();

  res.status(200).json({
    status: 'success',
    message: 'Doctor schedules retrieved successfully',
    results: schedules.length,
    data: { schedules },
  });
});

exports.getDoctorSchedule = catchAsync(async (req, res, next) => {
  const schedule = await DoctorScheduleService.getDrSchedule(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Doctor schedule retrieved successfully',
    data: { schedule },
  });
});

exports.createDoctorSchedule = catchAsync(async (req, res, next) => {
  const schedule = await DoctorScheduleService.createDrSchedule(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Doctor schedule created successfully',
    data: { schedule },
  });
});

exports.updateDoctorSchedule = catchAsync(async (req, res, next) => {
  const schedule = await DoctorScheduleService.updateDrSchedule(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    message: 'Doctor schedule updated successfully',
    data: { schedule },
  });
});

exports.deleteDoctorSchedule = catchAsync(async (req, res, next) => {
  await DoctorScheduleService.deleteSchedule(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Doctor schedule deleted successfully',
    data: null,
  });
});
