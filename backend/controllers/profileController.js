const Alumni = require("../Db/userSchema");

exports.getProfile = async (req, res) => {
  try {
    const user = await Alumni.findById(req.user.id)
      .select("-password")
      .populate("appliedJobs", "role company")
      .populate("attendedEvents", "title eventDate");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      company,
      jobTitle,
      linkedin,
      github,
      portfolio,
      location,
      bio,
      skills,
      experience,
      projects,
      achievements,
      coverImage,
      profileImage,
      resumeUrl
    } = req.body;

    const user = await Alumni.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.phone = phone !== undefined ? phone : user.phone;
    user.company = company !== undefined ? company : user.company;
    user.jobTitle = jobTitle !== undefined ? jobTitle : user.jobTitle;
    user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;
    user.github = github !== undefined ? github : user.github;
    user.portfolio = portfolio !== undefined ? portfolio : user.portfolio;
    user.location = location !== undefined ? location : user.location;
    user.bio = bio !== undefined ? bio : user.bio;
    user.skills = skills !== undefined ? skills : user.skills;
    user.experience = experience !== undefined ? experience : user.experience;
    user.projects = projects !== undefined ? projects : user.projects;
    user.achievements = achievements !== undefined ? achievements : user.achievements;
    user.coverImage = coverImage !== undefined ? coverImage : user.coverImage;
    user.profileImage = profileImage !== undefined ? profileImage : user.profileImage;
    user.resumeUrl = resumeUrl !== undefined ? resumeUrl : user.resumeUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        rollNo: user.rollNo,
        department: user.department,
        graduationYear: user.graduationYear,
        company: user.company,
        jobTitle: user.jobTitle,
        linkedin: user.linkedin,
        profileImage: user.profileImage,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};