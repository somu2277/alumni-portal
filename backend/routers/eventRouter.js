const express = require("express");

const router = express.Router();

const {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  rsvpEvent,
} = require(
  "../controllers/eventController"
);
const { verifyToken } = require("../controllers/authController");

router.get("/", getEvents);
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, updateEvent);
router.post("/:id/rsvp", verifyToken, rsvpEvent);
router.delete("/:id", verifyToken, deleteEvent);

module.exports = router;