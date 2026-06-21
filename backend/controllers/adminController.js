const Alumni = require("../Db/userSchema");
const Event = require("../Db/eventSchema");
const Job = require("../Db/jobSchema");

// Get Admin Dashboard Stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await Alumni.countDocuments();
    const verifiedAlumni = await Alumni.countDocuments({ isVerified: true });
    const pendingApprovals = await Alumni.countDocuments({ isVerified: false, role: "alumni" });
    const totalEvents = await Event.countDocuments();
    const totalJobs = await Job.countDocuments();

    // Verification Queue
    const pendingList = await Alumni.find({ isVerified: false, role: "alumni" })
      .select("-password")
      .sort({ createdAt: 1 });

    // Recent users list
    const recentUsers = await Alumni.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    // Registration counts grouped by department (simple aggregation)
    const deptStats = await Alumni.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedAlumni,
        pendingApprovals,
        totalEvents,
        totalJobs,
      },
      pendingList,
      recentUsers,
      deptStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Alumnus Verification Status
exports.toggleVerifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Alumni.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    // Create a notification for the verified/unverified user
    const Notification = require("../Db/notificationSchema");
    await Notification.create({
      recipient: user._id,
      type: "system",
      title: user.isVerified ? "Account Verified ✨" : "Account Verification Updated",
      message: user.isVerified
        ? "Congratulations! Your alumni profile has been verified by the administrator. You can now access all portal sections."
        : "Your verification status was modified by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: `User verification updated to ${user.isVerified}`,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User Profile
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Alumni.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clean up corresponding posts/applications/chat history (optional, or rely on cascading)
    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Role (Alumni <-> Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["alumni", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await Alumni.findByIdAndUpdate(id, { $set: { role } }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
