const mongoose = require('mongoose');
const validator = require('validator');

const settingsSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: [true, 'Name is required'],
    },

    email: {
      type: String,
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      googleMapLink: {
        type: String,
      },
    },

    workingHours: {
      open: { type: String },
      close: { type: String },
    },

    social: {
      facebook: String,
      instagram: String,
      tiktok: String,
      whatsapp: String,
    },
    
    logo: String,
    coverImage: String,
    gallery: [String],
  },
  { timestamps: true }
);

settingsSchema.index({ location: '2dsphere' });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
