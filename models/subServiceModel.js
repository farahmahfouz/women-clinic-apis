const mongoose = require('mongoose');
const slugify = require('slugify');

const subServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'SubService must have a name'],
      trim: true,
    },

    slug: String,

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'SubService must belong to a Service'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subServiceSchema.virtual('options', {
  ref: 'ServiceOption',
  foreignField: 'subService',
  localField: '_id',
});

subServiceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const SubService = mongoose.model('SubService', subServiceSchema);
module.exports = SubService;
