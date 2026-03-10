const { Router } = require('express');
const {
  getAllServiceOptions,
  getOneServiceOption,
  createServiceOption,
  updateServiceOption,
  deleteServiceOption,
} = require('../controllers/serviceOptionController');

const { uploadImages, handleImages } = require('../middlewares/images');
const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router({ mergeParams: true });

// ---------- Public Routes ----------
router.get('/', getAllServiceOptions);
router.get('/:id', getOneServiceOption);

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
  createServiceOption
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
  updateServiceOption
);
router.delete('/:id', protectTo('admin'), deleteServiceOption);

module.exports = router;
