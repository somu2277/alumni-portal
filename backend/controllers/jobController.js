const Job = require("../Db/jobSchema");

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Apply Job
exports.applyJob = async (req, res) => {
  try {
    const { resumeUrl = "Not provided", coverLetter } = req.body;

    const JobApplication = require("../Db/jobApplicationSchema");
    const Alumni = require("../Db/userSchema");

    const existing = await JobApplication.findOne({
      job: req.params.id,
      applicant: req.user.id,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await JobApplication.create({
      job: req.params.id,
      applicant: req.user.id,
      resumeUrl,
      coverLetter,
    });

    await Alumni.findByIdAndUpdate(req.user.id, {
      $addToSet: { appliedJobs: req.params.id },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job Applications
exports.getJobApplications = async (req, res) => {
  try {
    const JobApplication = require("../Db/jobApplicationSchema");
    const applications = await JobApplication.find({ job: req.params.id })
      .populate("applicant", "fullName email phone department graduationYear jobTitle company")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Applied Jobs for current user
exports.getAppliedJobs = async (req, res) => {
  try {
    const Alumni = require("../Db/userSchema");
    const user = await Alumni.findById(req.user.id).populate("appliedJobs");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      appliedJobs: user.appliedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Save Job
exports.toggleSaveJob = async (req, res) => {
  try {
    const Alumni = require("../Db/userSchema");
    const user = await Alumni.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Job removed from saved list" : "Job saved successfully",
      isSaved: !isSaved,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};