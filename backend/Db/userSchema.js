const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["alumni", "admin"],
      default: "alumni",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isMentor: {
      type: Boolean,
      default: false,
    },

    coverImage: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      }
    ],

    projects: [
      {
        projectName: String,
        description: String,
        link: String,
        techStack: String,
      }
    ],

    achievements: [
      {
        title: String,
        description: String,
      }
    ],

    resumeUrl: {
      type: String,
      default: "",
    },

    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],

    attendedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],

    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni"
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alumni", alumniSchema);