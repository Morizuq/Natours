//Yet to implement

const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();
// router.post('/create-booking/:tourId', bookingController.createBooking);

router.get(
  '/pay/:tourId',
  authController.protect,
  bookingController.initPayment
);

router.get('/', bookingController.checkout);

module.exports = router;
