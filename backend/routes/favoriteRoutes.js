const express = require("express");
const {
    getFavorites,
    getFavorite,
    addFavorite,
    updateFavorite,
    deleteFavorite
} = require("../controllers/favoriteController");
const auth = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", auth, getFavorites);
router.post("/", auth, validate(schemas.addFavorite), addFavorite);
router.get("/:id", auth, getFavorite);
router.put("/:id", auth, validate(schemas.updateFavorite), updateFavorite);
router.delete("/:id", auth, deleteFavorite);

module.exports = router;
