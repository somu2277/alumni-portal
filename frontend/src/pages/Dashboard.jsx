import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Calendar, Briefcase, ChevronRight, ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAlumni: 0,
    newRegistrations: 0,
    upcomingEvents: 0,
    jobOpportunities: 0,
    recentAlumni: [],
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/events")
      ]);
      setStats(statsRes.data);
      // Get the 3 closest upcoming events
      const upcoming = eventsRes.data.events.slice(0, 3);
      setEvents(upcoming);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading Dashboard...</div>;
  }

  const statCards = [
    { title: "Total Alumni", value: stats.totalAlumni, icon: <Users size={24} />, color: "blue", trend: "All Time" },
    { title: "New Registrations", value: stats.newRegistrations, icon: <UserPlus size={24} />, color: "green", trend: "Last 30d" },
    { title: "Upcoming Events", value: stats.upcomingEvents, icon: <Calendar size={24} />, color: "purple", trend: "Active" },
    { title: "Job Opportunities", value: stats.jobOpportunities, icon: <Briefcase size={24} />, color: "orange", trend: "Active" },
  ];

  return (
    <div className="dashboard-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <h1>Welcome back, {user.fullName ? user.fullName.split(' ')[0] : 'Alumni'} 👋</h1>
          <p>Stay connected with alumni, opportunities, and events in one place.</p>
        </div>
      </motion.div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <motion.div 
            className="stat-card" 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`stat-icon-wrapper ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className="stat-trend">{stat.trend}</div>
          </motion.div>
        ))}
      </div>



      <div className="dashboard-content-grid">
        <motion.div 
          className="recent-alumni-section card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card-header">
            <h2>Recent Alumni Joined</h2>
            <button className="view-all" onClick={() => navigate('/directory')}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="alumni-list">
            {Array.isArray(stats.recentAlumni) && stats.recentAlumni.length > 0 ? stats.recentAlumni.map((alumni) => (
              <div className="alumni-list-item" key={alumni._id}>
                <div className="alumni-avatar">
                  {alumni.fullName?.charAt(0)}
                </div>
                <div className="alumni-details">
                  <h4>{alumni.fullName}</h4>
                  <p>{alumni.department || "N/A"} • Class of {alumni.graduationYear || "N/A"}</p>
                </div>
                <button className="view-profile-btn" onClick={() => navigate(`/directory/${alumni._id}`)}>
                  View <ArrowUpRight size={14} />
                </button>
              </div>
            )) : <p className="empty-state">No recent alumni found.</p>}
          </div>
        </motion.div>

        <motion.div 
          className="upcoming-events-section card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-header">
            <h2>Upcoming Events</h2>
            <button className="view-all" onClick={() => navigate('/events')}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="alumni-list">
            {Array.isArray(events) && events.length > 0 ? events.map((event, index) => (
              <div 
                className="alumni-list-item" 
                key={event._id || index}
                style={{ alignItems: "flex-start" }}
              >
                <div className="alumni-avatar" style={{ backgroundColor: "var(--primary-light)", borderRadius: "8px" }}>
                  <Calendar size={20} />
                </div>
                <div className="alumni-details">
                  <h4>{event.title}</h4>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px", margin: "4px 0" }}>
                    <Calendar size={12} /> {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} /> {event.location} • By {event.organizer}
                  </p>
                </div>
              </div>
            )) : <p className="empty-state">No upcoming events right now.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;