const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "rejected", "accepted"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
