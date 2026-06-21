const Event = require("../Db/eventSchema");

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({
      eventDate: 1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(
      req.body
    );

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RSVP Event
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const userId = req.user.id;
    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      event.attendees = event.attendees.filter(id => id.toString() !== userId);
    } else {
      event.attendees.push(userId);
    }

    await event.save();

    const Alumni = require("../Db/userSchema");
    if (isAttending) {
      await Alumni.findByIdAndUpdate(userId, { $pull: { attendedEvents: event._id } });
    } else {
      await Alumni.findByIdAndUpdate(userId, { $addToSet: { attendedEvents: event._id } });
    }

    res.status(200).json({
      success: true,
      message: isAttending ? "RSVP cancelled" : "RSVP registered successfully",
      isAttending: !isAttending,
      attendees: event.attendees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};