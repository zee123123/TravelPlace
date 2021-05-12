const Travelplace = require('../models/travelplace');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const travelplace = await Travelplace.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  travelplace.reviews.push(review);
  await review.save();
  await travelplace.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/travelplaces/${travelplace._id}`);
}

module.exports.deleteReview = async (req, res) => {
  const {
    id,
    reviewId
  } = req.params;
  await Travelplace.findByIdAndUpdate(id, {
    $pull: {
      reviews: reviewId
    }
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review')
  res.redirect(`/travelplaces/${id}`);
}
