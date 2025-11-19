const Review = require('../models/reviewModel');

exports.getAllReview = async (filter) => {
  const reviews = await Review.find(filter);
  return reviews;
};

exports.getOneReview = async (id) => {
  const review = await Review.findById(id);
  if (!review) throw new AppError('Review not found', 404);
  return review;
};

exports.createReview = async (data) => {
  const review = await Review.create(data);
  return review;
};

exports.updateReview = async (id, data) => {
  const review = await Review.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!review) throw new AppError('Review not found', 404);
  return review;
};

exports.deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new AppError('Review not found', 404);
};
