require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./models/connect");

const alumniRoutes = require(
  "./routers/alumniRouter"
);
const authRoutes = require("./routers/router");
const dashboardRoutes = require(
  "./routers/dashboardRouter"
);
const profileRoutes = require(
  "./routers/profileRouter"
);

const eventRoutes = require(
  "./routers/eventRouter"
);
const jobRoutes = require(
  "./routers/jobRouter"
);
const testimonialRoutes = require(
  "./routers/testimonialRouter"
);

const notificationRoutes = require("./routers/notificationRouter");
const adminRoutes = require("./routers/adminRouter");

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));

// Custom In-place Mongo Injection Sanitizer Middleware for Express 5 Compatibility
const sanitizeInput = (req, res, next) => {
  const clean = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          clean(obj[key]);
        }
      }
    }
  };
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
};

app.use(sanitizeInput);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

app.use(express.json());

connectDB();

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use(
  "/api/alumni",
  alumniRoutes
);
app.use("/api/profile", profileRoutes);

// Serve frontend in production
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});