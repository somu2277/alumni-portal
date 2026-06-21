const express = require("express");
const router = express.Router();

const {
  register,
  login,
  changePassword,
  verifyToken,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;