const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

router
  .route('/top-cheap')
  .get(tourController.aliasTopCheap, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/month-plan/:year')
  .get(authController.protect, tourController.getMonthPlan);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getTourDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.createTour
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.tourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
