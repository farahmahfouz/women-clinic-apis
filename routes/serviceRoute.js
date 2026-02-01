const { Router } = require('express');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { uploadImages, handleImages } = require('../middlewares/images');
const reviewRouter = require('./reviewRoute');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router();

router.use('/:serviceId/reviews', reviewRouter);

// ---------- Public Routes ----------
router.get('/', getAllServices);
router.get('/:id', getService);

// ---------- Protected Routes ----------
router.use(auth);

router.post(
  '/',
  protectTo('admin'),
  uploadImages([
    { name: 'logo', count: 1 },
    { name: 'coverImage', count: 1 },
    { name: 'gallery', count: 20 },
  ]),
  handleImages('logo'),
  handleImages('coverImage'),
  handleImages('gallery'),
  createService
);
router.patch(
  '/:id',
  protectTo('admin'),
  uploadImages([
    { name: 'logo', count: 1 },
    { name: 'coverImage', count: 1 },
    { name: 'gallery', count: 20 },
  ]),
  handleImages('logo'),
  handleImages('coverImage'),
  handleImages('gallery'),
  updateService
);
router.delete('/:id', protectTo('admin'), deleteService);

module.exports = router;
