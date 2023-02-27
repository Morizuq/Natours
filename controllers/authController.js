const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

//A function to create token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//Sending response, cookie and token
const createSendToken = (user, status, res) => {
  //Create token
  const token = signToken(user._id);
  //Cookie
  //Cookie options
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  //Hide password
  user.password = undefined;
  //Send response
  res.cookie('jwt', token, cookieOptions);

  res.status(status).json({
    status: 'success',
    token,
    // data: {
    //   user,
    // },
  });
};

//Signup controller
exports.signup = catchAsync(async (req, res, next) => {
  //Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  //Send a welcome message
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  //Create token and send response
  createSendToken(newUser, 201, res);
});

//Login controller
exports.login = catchAsync(async (req, res, next) => {
  //Get req email and password
  const { email, password } = req.body;
  //If no input email or password, send error
  if (!email || !password)
    return next(new AppError('Please input email and password', 400));
  //Get user
  const user = await User.findOne({ email }).select('+password');
  //Check if input email and password matches an existing user
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Wrong email or password', 401));
  }

  //Create token and send response
  createSendToken(user, 200, res);
});

//Logout controller
exports.logout = async (req, res) => {
  //Overwrite the cookie
  res.cookie('jwt', 'randomlogoutstuff', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  //Send a response with status 'success'
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Get our token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //If token doesn't exist, send a login error
  if (!token) {
    return next(new AppError('Please log in', 401));
  }
  //Decode our token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exist
  const currentUser = await User.findById(decoded.id);
  //if user doesn't exist, send error
  if (!currentUser) {
    return next(new AppError('User does not exist'), 401);
  }

  //Check if user has changed passord after token have been issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return new AppError('Password changed, login again!', 401);
  }
  //Set user so the next middleware can have access to 'req.user'
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  //Check if jswt cookie exist
  try {
    if (req.cookies.jwt) {
      //decode the cookie
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //Find user by id
      const currentUser = await User.findById(decoded.id);
      //if user doesnt exist, move to the next middleware
      if (!currentUser) {
        return next();
      }
      //If user changed password after jwt was issued, move to the next middleware
      if (currentUser.passwordChangedAfter(decoded.iat)) {
        return next();
      }
      //
      res.locals.user = currentUser;
      return next();
    }
  } catch (error) {
    return next();
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return new AppError('You are not authorized to perfom this action', 403);
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError('No user matches that email, please try again!', 400)
    );
  }

  //If user is found, mail a token to the user
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  //send mail
  try {
    await new Email(user, resetURL).sendPasswordReset();
    //If successful
    res.status(200).json({
      status: 'success',
      message: 'Email sent successsfully',
    });
  } catch (err) {
    //If fail
    (user.passwordResetToken = undefined),
      (user.passwordResetTokenExpires = undefined);

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Something went wrong, try again!', 400));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get reset token from params
  const resetToken = req.params.token;
  //Encrypt reset token
  const encryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //Get user if token is not expired
  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  //If no user is found, send an error
  if (!user) {
    return new AppError('Invalid token or token is expired', 400);
  }

  //Update user's password and remove the reset token along with token expires
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  //Create token and send response
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user
  const user = await User.findById(req.user.id).select('+password');

  //if (!user) next(new AppError('Please log in', 403));

  //Confirm password and update password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Create token and send response
  createSendToken(user, 200, res);
});
