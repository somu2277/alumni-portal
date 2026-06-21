const express = require("express");

const router = express.Router();

const {
  getAllAlumni,
  getAlumniById,
} = require("../controllers/alumniController");
const { verifyToken } = require("../controllers/authController");

router.get("/", verifyToken, getAllAlumni);
router.get("/:id", verifyToken, getAlumniById);

module.exports = router;