const express = require("express");

const router = express.Router();

const {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
  applyJob,
  getJobApplications,
  getAppliedJobs,
  toggleSaveJob,
} = require(
  "../controllers/jobController"
);
const { verifyToken } = require("../controllers/authController");

router.get("/", getJobs);
router.post("/", verifyToken, createJob);
router.get("/applied", verifyToken, getAppliedJobs);
router.put("/:id", verifyToken, updateJob);
router.post("/:id/apply", verifyToken, applyJob);
router.get("/:id/applications", verifyToken, getJobApplications);
router.post("/:id/save", verifyToken, toggleSaveJob);
router.delete("/:id", verifyToken, deleteJob);

module.exports = router;