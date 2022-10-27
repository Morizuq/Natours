//Yet to implement

const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// router.post('/create-booking/:tourId', bookingController.createBooking);

// router.post(
//   '/checkout/:tourId/capture',
//   authController.protect,
//   bookingController.createPayment
// );

module.exports = router;
