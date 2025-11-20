const SettingsService = require('../services/settingService');
const catchAsync = require('../utils/catchAsync');

exports.getSettings = catchAsync(async (req, res, next) => {
  const settings = await SettingsService.getSettings();

  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

exports.createSettings = catchAsync(async (req, res, next) => {
  const settings = await SettingsService.createSettings(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Settings created successfully',
    data: { settings },
  });
});

exports.updateSettings = catchAsync(async (req, res, next) => {
  const updatedSettings = await SettingsService.updateSettings(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Settings updated successfully',
    data: { settings: updatedSettings },
  });
});
