const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./factoryHandler');
// const { findByIdAndDelete } = require('../models/user');

//Below is best for when there is no image resize or stuff
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },

//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const name = `user-${req.user.id}-${Date.now}.${ext}`;
//     cb(null, name);
//   },
// });

//But the memoryStorage is best for when there is need to resize images etc..
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImage = upload.single('photo');

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// USER SHOULD ONLY BE CREATED FROM THE AUTH CONTROLLER
// exports.createUser = catchAsync(async (req, res) => {
//   const user = await User.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: { user },
//   });
// });

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); //Remember  not to update password lest it give err :}
exports.deleteUser = factory.deleteOne(User);

//A middleware that let the logged in users get their own details
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//Yeah, this is the endpoint for the user to change stuffs :}
exports.updateMe = catchAsync(async (req, res, next) => {
  //Get user
  const user = req.user;

  //Check if input include password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Can't change password here, go to /updatePassword")
    );
  }
  //Filter out unneccessary inputs - 'comot body joor!'
  const filteredBody = filterObj(req.body, 'name', 'email');
  //Just add the damn filename if it exists :}
  if (req.file) filteredBody.photo = req.file.filename;
  //Update user
  const newUser = await User.findByIdAndUpdate(user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //Send response
  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

//Hehe, tryna delete your account? I got you :}
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
