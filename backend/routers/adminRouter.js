const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  toggleVerifyAlumni,
  deleteUser,
  updateUserRole,
} = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../controllers/authController");

router.get("/stats", verifyToken, verifyAdmin, getAdminStats);
router.put("/verify/:id", verifyToken, verifyAdmin, toggleVerifyAlumni);
router.put("/role/:id", verifyToken, verifyAdmin, updateUserRole);
router.delete("/user/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
