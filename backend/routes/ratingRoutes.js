const express = require("express");
const { addRating, updateRating } = require("../controllers/ratingController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, addRating);
router.put("/:movieId", auth, updateRating);

module.exports = router;
