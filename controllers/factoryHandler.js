const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

//The ancestor of the createOne controller
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

//The ancestor of the getAll controller
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // let filter = {};

    // if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    //If request was successful
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

//The ancestor of the getOne controller
exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;
    //If Document wasn't found
    if (!doc) {
      return new AppError('Document not found', 404);
    }
    //If Document was found
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

//The ancestor of the update controller
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //If Document wasn't found
    if (!doc) {
      return new AppError('Tour not found', 404);
    }
    //If request was successful
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

//The ancestor of the delete controller
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    //If Document wasn't found
    if (!doc) {
      return new AppError('Tour not found', 404);
    }
    //If request was successful
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
