const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/popular", movieController.getPopularMovies);
router.get("/top_rated", movieController.getTopRatedMovies);
router.get("/upcoming", movieController.getUpcomingMovies);
router.get("/search", movieController.searchMovies);
router.get("/:id", movieController.getMovieDetails);

module.exports = router;
