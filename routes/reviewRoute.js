const { Router } = require('express');
const {
  getAllReviews,
  getOneReview,
  createReview,
  updateReview,
  deleteReview,
  setServicesUserIds,
} = require('../controllers/reviewController');

const { auth, protectTo } = require('../middlewares/authMiddlerware');

const router = Router({ mergeParams: true });

// ---------- Public Routes ----------
router.get('/', getAllReviews);
router.get('/:id', getOneReview);

// ---------- Protected Routes ----------
router.use(auth);

router.post('/', protectTo('patient'), setServicesUserIds, createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
