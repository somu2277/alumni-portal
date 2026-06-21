const Alumni = require("../Db/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      rollNo,
      department,
      graduationYear,
      company,
      jobTitle,
      linkedin,
      password,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !rollNo ||
      !department ||
      !graduationYear ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingEmail = await Alumni.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const existingRollNo = await Alumni.findOne({ rollNo });

    if (existingRollNo) {
      return res.status(400).json({
        success: false,
        message: "Roll Number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Alumni.create({
      fullName,
      email,
      phone,
      rollNo,
      department,
      graduationYear,
      company,
      jobTitle,
      linkedin,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await Alumni.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is missing in .env file",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
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
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MIDDLEWARE =================
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied: Admins only",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const user = await Alumni.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};