const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    postedBy: {
      type: String,
      default: "Alumni",
    },

    requirements: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Job",
  jobSchema
);