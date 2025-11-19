const { Router } = require('express');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const reviewRouter = require('./reviewRoute');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router();

router.use('/:serviceId/reviews', reviewRouter);

// ---------- Public Routes ----------
router.get('/', getAllServices);
router.get('/:id', getService);

// ---------- Protected Routes ----------
router.use(auth);

router.post('/', protectTo('admin'), createService);
router.patch('/:id', protectTo('admin'), updateService);
router.delete('/:id', protectTo('admin'), deleteService);

module.exports = router;
