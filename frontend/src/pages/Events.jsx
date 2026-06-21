import { useEffect, useState } from "react";
import api from "../api";
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Plus, Trash2, Edit3, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, past

  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    location: "", 
    eventDate: "",
    organizer: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data.events || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("Could not delete event");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
      organizer: event.organizer || ""
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      organizer: currentUser.fullName || "Alumni Association"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Edit
        const res = await api.put(`/events/${editingEvent._id}`, formData);
        if (res.data.success) {
          setEvents(events.map(e => e._id === editingEvent._id ? res.data.event : e));
          alert("Event updated successfully!");
        }
      } else {
        // Create
        const res = await api.post("/events", formData);
        if (res.data.success) {
          setEvents([res.data.event, ...events]);
          alert("Event created successfully!");
        }
      }
      setShowModal(false);
    } catch (error) {
      console.log("Could not save event", error);
      alert("Error saving event");
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/rsvp`);
      if (res.data.success) {
        // Update local events list with new attendees array
        setEvents(events.map(ev => {
          if (ev._id === eventId) {
            return {
              ...ev,
              attendees: res.data.attendees
            };
          }
          return ev;
        }));
        alert(res.data.message);
      }
    } catch (error) {
      console.log("Error RSVPing", error);
      alert("Failed to RSVP");
    }
  };

  const handleShare = (event) => {
    const shareText = `Check out this event: "${event.title}" on ${new Date(event.eventDate).toLocaleDateString()} at ${event.location}!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert("Event details copied to clipboard!");
    } else {
      alert(shareText);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading Events...</div>;
  }

  // Filter events
  const today = new Date();
  const upcomingEvents = events.filter(e => new Date(e.eventDate) >= today);
  const pastEvents = events.filter(e => new Date(e.eventDate) < today);
  const activeEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  // Featured Event: closest upcoming event
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1>Events Portal</h1>
          <p>Join webinars, meetups, and conferences with your fellow alumni.</p>
        </div>
        <button className="post-event-btn" onClick={handleOpenCreate}>
          <Plus size={16} /> Host an Event
        </button>
      </div>

      {featuredEvent && activeTab === "upcoming" && (
        <div className="events-banner">
          <div className="banner-content">
            <span className="featured-tag">Featured Event</span>
            <h2>{featuredEvent.title}</h2>
            <p>{featuredEvent.description}</p>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button 
                className="register-main-btn"
                onClick={() => handleRSVP(featuredEvent._id)}
              >
                {Array.isArray(featuredEvent.attendees) && featuredEvent.attendees.includes(currentUser.id) ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Check size={16} /> Attending</span>
                ) : (
                  "RSVP / Attend"
                )}
              </button>
              <button className="share-btn" style={{ color: "white", borderColor: "white" }} onClick={() => handleShare(featuredEvent)}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", margin: "24px 0", gap: "24px" }}>
        <button 
          onClick={() => setActiveTab("upcoming")}
          style={{ 
            background: "none", 
            border: "none", 
            paddingBottom: "12px", 
            fontSize: "16px", 
            fontWeight: "600", 
            color: activeTab === "upcoming" ? "var(--accent)" : "var(--text-light)", 
            borderBottom: activeTab === "upcoming" ? "2px solid var(--accent)" : "none",
            cursor: "pointer"
          }}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab("past")}
          style={{ 
            background: "none", 
            border: "none", 
            paddingBottom: "12px", 
            fontSize: "16px", 
            fontWeight: "600", 
            color: activeTab === "past" ? "var(--accent)" : "var(--text-light)", 
            borderBottom: activeTab === "past" ? "2px solid var(--accent)" : "none",
            cursor: "pointer"
          }}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      <div className="events-grid">
        {activeEvents.length > 0 ? activeEvents.map((event, index) => {
          const isAttending = Array.isArray(event.attendees) && event.attendees.includes(currentUser.id);
          const isAdmin = currentUser.role === "admin";
          const isOrganizer = event.organizer === currentUser.fullName;

          return (
            <motion.div
              key={event._id}
              className="event-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="event-date-box">
                <span className="month">{new Date(event.eventDate).toLocaleString('default', { month: 'short' })}</span>
                <span className="day">{new Date(event.eventDate).getDate()}</span>
              </div>
              
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-meta">
                  <span><MapPin size={16} /> {event.location}</span>
                  <span><Clock size={16} /> {new Date(event.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span><Users size={16} /> {Array.isArray(event.attendees) ? event.attendees.length : 0} Attendees</span>
                  <span><Clock size={16} /> By {event.organizer || "Alumni Assoc"}</span>
                </div>
              </div>

              <div className="event-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(isAdmin || isOrganizer) && (
                    <>
                      <button className="view-profile-btn" style={{ padding: "6px 12px" }} onClick={() => handleOpenEdit(event)}>
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className="view-profile-btn" style={{ padding: "6px 12px", color: "var(--danger-text)", borderColor: "var(--danger-text)" }} onClick={() => handleDelete(event._id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="share-btn" onClick={() => handleShare(event)}><Share2 size={16} /></button>
                  {activeTab === "upcoming" && (
                    <button 
                      className={`register-btn ${isAttending ? "attending" : ""}`}
                      onClick={() => handleRSVP(event._id)}
                      style={{ 
                        backgroundColor: isAttending ? "var(--success-bg)" : "var(--accent)", 
                        color: isAttending ? "var(--success-text)" : "white",
                        borderColor: isAttending ? "var(--success-text)" : "transparent"
                      }}
                    >
                      {isAttending ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Check size={14} /> Attending</span>
                      ) : (
                        <span>Attend <ArrowRight size={14} /></span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div className="no-events-state" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px" }}>
            <Calendar size={48} className="empty-icon" style={{ margin: "0 auto 16px auto", color: "var(--text-light)" }} />
            <h3>No events found</h3>
            <p>Check back later or host your own event!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEvent ? "Edit Event details" : "Host a New Event"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Location / Link</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Date and Time</label>
                <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Organizer Name</label>
                <input type="text" name="organizer" value={formData.organizer} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">{editingEvent ? "Save changes" : "Create Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;