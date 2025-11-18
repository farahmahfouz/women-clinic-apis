const mongoose = require('mongoose');

const subServiceOptionSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: [true, 'Option must belong to a Service'],
    },

    optionName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: [true, 'Option must have a price'],
    },

    type: {
      type: String,
      enum: ['pulse', 'session', 'package', 'ml', 'unit'],
      default: 'session',
    },

    notes: String,
    stock: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const SubServiceOption = mongoose.model(
  'ServiceOption',
  subServiceOptionSchema
);
module.exports = SubServiceOption;
