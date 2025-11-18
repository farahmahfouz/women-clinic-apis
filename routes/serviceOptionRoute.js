const { Router } = require('express');
const {
  getAllServiceOptions,
  getOneServiceOption,
  createServiceOption,
  updateServiceOption,
  deleteServiceOption,
} = require('../controllers/serviceOptionController');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router();

// ---------- Public Routes ----------
router.get('/', getAllServiceOptions);
router.get('/:id', getOneServiceOption);

// ---------- Protected Routes ----------
router.use(auth);

router.post('/', protectTo('admin'), createServiceOption);
router.patch('/:id', protectTo('admin'), updateServiceOption);
router.delete('/:id', protectTo('admin'), deleteServiceOption);

module.exports = router;

