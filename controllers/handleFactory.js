const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');

exports.getAll = (Model) =>
  handleAsync(async (req, res, next) => {
    const filter = req.params.id ? { tour: req.params.id } : {};

    // Create features object which takes mongoose query & query string and then
    // append functions which return the object with appended query then execute
    // final obj.query.
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      message: 'documents fetched',
      results: doc.length,
      data: doc,
    });
  });

exports.getOne = (Model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) {
      return next(new AppError(404, `No doc found with this ID`));
    }

    res.status(200).json({
      status: 'success',
      message: 'document fetched',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  handleAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'document created',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;
    const update = req.body;

    const doc = await Model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(404, `No doc found with this id.`));
    }

    res.status(200).json({
      status: 'success',
      message: 'document updated',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError(404, `No doc found with this Id`));
    }

    res.status(201).json({
      status: 'success',
      message: 'document Deleted',
    });
  });
