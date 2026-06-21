const Alumni = require("../Db/userSchema");
const Event = require("../Db/eventSchema");
const Job = require("../Db/jobSchema");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const upcomingEvents = await Event.countDocuments();
    const jobOpportunities = await Job.countDocuments();
    const activeMentors = await Alumni.countDocuments({ isMentor: true });

    // Since we don't have a reliable way to get "new registrations" easily without a date filter,
    // let's say anyone registered in the last 30 days is a "new registration".
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newRegistrations = await Alumni.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const recentAlumni = await Alumni.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalAlumni,
      activeMentors,
      newRegistrations,
      upcomingEvents,
      jobOpportunities,
      recentAlumni,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};