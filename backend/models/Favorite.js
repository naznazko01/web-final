const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  poster: { type: String },
  status: { type: String, enum: ["planned", "watching", "watched"], default: "planned" }
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
