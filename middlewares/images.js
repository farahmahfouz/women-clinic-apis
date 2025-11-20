const multer = require('multer');
const AppError = require('../utils/appError');
const ImageKit = require('imagekit');

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

// Multer storage configuration to keep files in memory
const multerStorage = multer.memoryStorage();

// Filter to only allow image files
const multerFilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images.', 400), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterImage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 5 MB limit
  },
});

// Middleware to upload images using Multer
exports.uploadImages = (fields) => {
  return upload.fields([
    ...fields.map((field) => ({ name: field.name, maxCount: field.count })),
  ]);
};

// Middleware to handle and upload images to ImageKit
exports.handleImages = (fieldname) => {
  return async (req, res, next) => {
    const files = req.files?.[fieldname];

    if (!files) return next();

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await imagekit.upload({
            file: file.buffer,
            fileName: `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpeg`,
            folder: '/uploads',
          });
          return result;
        })
      );

      req.body[fieldname] =
        uploadedImages.length === 1
          ? uploadedImages[0].url
          : uploadedImages.map((file) => file.url);

      next();
    } catch (error) {
      return next(new AppError('Error uploading images to ImageKit', 500));
    }
  };
};