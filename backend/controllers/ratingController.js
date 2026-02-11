const Rating = require("../models/Rating");

exports.addRating = async (req, res) => {
  const { movieId, rating } = req.body;

  const existing = await Rating.findOne({ user: req.user._id, movieId });
  if (existing) return res.status(400).json({ message: "You already rated this movie" });

  const newRating = await Rating.create({ user: req.user._id, movieId, rating });
  res.status(201).json(newRating);
};

exports.updateRating = async (req, res) => {
  const { rating } = req.body;
  const ratingDoc = await Rating.findOne({ user: req.user._id, movieId: req.params.movieId });
  if (!ratingDoc) return res.status(404).json({ message: "Rating not found" });

  ratingDoc.rating = rating;
  await ratingDoc.save();
  res.json(ratingDoc);
};
