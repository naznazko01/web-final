const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, validate(schemas.updateProfile), updateProfile);

module.exports = router;
