import { useEffect, useState } from "react";
import api from "../api";
import { Bell, Calendar, Briefcase, UserPlus, MessageSquare, Info, Trash2, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.log("Error loading notifications list", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put("/notifications/read-all");
      if (res.data.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        alert("All notifications marked as read!");
      }
    } catch (error) {
      console.log("Error marking notifications read", error);
    }
  };

  const handleMarkSingleRead = async (id, alreadyRead) => {
    if (alreadyRead) return;
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.log("Error marking notification read", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event":
        return <Calendar size={20} style={{ color: "var(--primary)" }} />;
      case "job":
        return <Briefcase size={20} style={{ color: "var(--accent)" }} />;
      case "connection":
        return <UserPlus size={20} style={{ color: "#10B981" }} />;
      case "message":
        return <MessageSquare size={20} style={{ color: "#F59E0B" }} />;
      default:
        return <Bell size={20} style={{ color: "#6366F1" }} />;
    }
  };

  if (loading) {
    return <div className="loading-state">Loading your notifications...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>Notifications Board</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            style={{ 
              display: "flex", alignItems: "center", gap: "6px", backgroundColor: "var(--primary-light)", 
              color: "var(--primary)", border: "1px solid var(--border-light)", padding: "8px 16px", 
              borderRadius: "var(--radius-md)", fontWeight: "600", fontSize: "13px", cursor: "pointer" 
            }}
          >
            <CheckCircle2 size={16} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {notifications.length > 0 ? notifications.map((noti, index) => (
          <motion.div
            key={noti._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={() => handleMarkSingleRead(noti._id, noti.read)}
            style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              padding: "16px 20px", 
              borderRadius: "var(--radius-lg)", 
              backgroundColor: noti.read ? "var(--bg-card)" : "var(--primary-light)", 
              border: "1px solid var(--border-light)",
              cursor: noti.read ? "default" : "pointer",
              boxShadow: noti.read ? "var(--shadow-sm)" : "var(--shadow-md)",
              transition: "all 0.2s ease",
              position: "relative"
            }}
          >
            {/* Unread indicator dot */}
            {!noti.read && (
              <span style={{ position: "absolute", top: "20px", left: "8px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent)" }}></span>
            )}

            <div style={{ 
              width: "40px", height: "40px", borderRadius: "8px", 
              backgroundColor: noti.read ? "var(--bg-hover)" : "var(--bg-card)", 
              display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", flexShrink: "0" 
            }}>
              {getNotificationIcon(noti.type)}
            </div>

            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "15px", fontWeight: noti.read ? "600" : "700", color: "var(--text-dark)" }}>{noti.title}</h3>
                <span style={{ fontSize: "11px", color: "var(--text-light)" }}>{new Date(noti.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", lineHeight: "1.5" }}>{noti.message}</p>
            </div>
          </motion.div>
        )) : (
          <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
            <Bell size={48} style={{ margin: "0 auto 16px auto", color: "var(--text-light)" }} />
            <h3>No notifications yet</h3>
            <p style={{ marginTop: "4px", fontSize: "14px" }}>We will let you know when jobs, events, or connections update!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
