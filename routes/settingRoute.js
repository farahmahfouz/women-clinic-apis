const { Router } = require('express');
const {
  getSettings,
  createSettings,
  updateSettings,
} = require('../controllers/settingController');

const { auth, protectTo } = require('../middlewares/authMiddlerware');
const { uploadImages, handleImages } = require('../middlewares/images');

const router = Router();

// ---------- Public Routes ----------
router.get('/', getSettings);

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
  createSettings
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
  updateSettings
);

module.exports = router;
