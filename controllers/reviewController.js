const Review = require('./../models/reviews');
const factory = require('./factoryHandler');

exports.setTourUserId = (req, res, next) => {
  //Getting the tour from the params if not specified in the json body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //Getting the user from the data sent from the 'protect' middleware i.e the id of the logged in user
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReviews = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);