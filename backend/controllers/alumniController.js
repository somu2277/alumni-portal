const Alumni = require("../Db/userSchema");

exports.getAllAlumni = async (req, res) => {
  try {
    const {
      search,
      department,
      graduationYear,
      location,
      company,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Removed isVerified filter to allow all registered alumni to be visible

    // Apply filters
    if (department) {
      query.department = { $regex: department, $options: "i" };
    }
    if (graduationYear) {
      query.graduationYear = Number(graduationYear);
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    // Apply general search term across multiple fields
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { fullName: searchRegex },
        { department: searchRegex },
        { company: searchRegex },
        { jobTitle: searchRegex },
        { location: searchRegex },
      ];
      
      // Check if search term is a number (for graduationYear)
      if (!isNaN(search)) {
        query.$or.push({ graduationYear: Number(search) });
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const alumni = await Alumni.find(query)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
      success: true,
      alumni,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAlumniById = async (req, res) => {
  try {
    const user = await Alumni.findById(req.params.id)
      .select("-password")
      .populate("appliedJobs", "role company location salary status")
      .populate("attendedEvents", "title eventDate location");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      alumni: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};