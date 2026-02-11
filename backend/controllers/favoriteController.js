const Favorite = require("../models/Favorite");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    results: favorites.length,
    data: {
      favorites,
    },
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
  const { movieId, title, poster } = req.body;

  const existing = await Favorite.findOne({ user: req.user._id, movieId });
  if (existing) {
    return next(new AppError("Movie already in favorites", 400));
  }

  const favorite = await Favorite.create({
    user: req.user._id,
    movieId,
    title,
    poster,
  });

  res.status(201).json({
    status: "success",
    data: {
      favorite,
    },
  });
});

exports.getFavorite = catchAsync(async (req, res, next) => {
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite || favorite.user.toString() !== req.user._id.toString()) {
    return next(new AppError("No favorite found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      favorite,
    },
  });
});

exports.updateFavorite = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite) {
    return next(new AppError("No favorite found with that ID", 404));
  }

  if (favorite.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  if (status) favorite.status = status;
  await favorite.save();

  res.status(200).json({
    status: "success",
    data: {
      favorite,
    },
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite) {
    return next(new AppError("No favorite found with that ID", 404));
  }

  if (favorite.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  await Favorite.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

