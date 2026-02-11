const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchFromTMDB = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                ...params,
            },
        });
        return response.data;
    } catch (error) {
        throw new AppError(
            error.response?.data?.status_message || "Error fetching data from TMDB",
            error.response?.status || 500
        );
    }
};

exports.getPopularMovies = catchAsync(async (req, res, next) => {
    const data = await fetchFromTMDB("/movie/popular", req.query);
    res.status(200).json({
        status: "success",
        data,
    });
});

exports.getMovieDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`/movie/${id}`, {
        append_to_response: "credits,videos,recommendations,watch/providers",
    });
    res.status(200).json({
        status: "success",
        data,
    });
});

exports.searchMovies = catchAsync(async (req, res, next) => {
    const { query } = req.query;
    if (!query) return next(new AppError("Please provide a search query", 400));

    const data = await fetchFromTMDB("/search/movie", { query });
    res.status(200).json({
        status: "success",
        data,
    });
});

exports.getTopRatedMovies = catchAsync(async (req, res, next) => {
    const data = await fetchFromTMDB("/movie/top_rated", req.query);
    res.status(200).json({
        status: "success",
        data,
    });
});

exports.getUpcomingMovies = catchAsync(async (req, res, next) => {
    const data = await fetchFromTMDB("/movie/upcoming", req.query);
    res.status(200).json({
        status: "success",
        data,
    });
});
