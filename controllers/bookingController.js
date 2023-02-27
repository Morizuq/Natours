const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY_TEST);
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tour');
const AppError = require('../utils/appError');

exports.initPayment = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const amount = tour.price * 100;
  console.log(tour.price);
  const email = req.user.email;
  console.log(req.user.email);
  //   const email = 'testing@test.com';
  const callbackUrl = `${req.protocol}://${req.get('host')}/`;

  const initializeResponse = await paystack.transaction.initialize({
    amount,
    email,
    callback_url: callbackUrl,
  });
  console.log(initializeResponse);
  res.redirect(initializeResponse.data.authorization_url);
});

exports.checkout = catchAsync(async (req, res, next) => {
  const reference = req.query.reference;

  const verifyResponse = await paystack.transaction.verify(reference);
  const data = verifyResponse.data;
  if (data.status === 'success') {
    //Do something with the data
    //Send mail and store to the db
    res.status(200).json({
      status: 'success',
      message: 'Transaction was successful',
    });
  } else {
    new AppError('500', 'Transaction was not successful');
  }
});
