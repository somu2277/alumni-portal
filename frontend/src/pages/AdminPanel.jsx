import { useEffect, useState } from "react";
import api from "../api";
import { ShieldCheck, UserCheck, Trash2, ShieldAlert, BarChart3, Users, Briefcase, Calendar, Shield, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("queue");
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      setAdminData(res.data);
    } catch (error) {
      console.log("Error loading admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      const res = await api.put(`/admin/verify/${id}`);
      if (res.data.success) {
        alert(res.data.message);
        // Refresh local lists
        setAdminData({
          ...adminData,
          pendingList: adminData.pendingList.filter(u => u._id !== id),
          stats: {
            ...adminData.stats,
            verifiedAlumni: adminData.stats.verifiedAlumni + 1,
            pendingApprovals: adminData.stats.pendingApprovals - 1,
          }
        });
      }
    } catch (error) {
      console.log("Error verifying alumni", error);
      alert("Verification failed");
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const nextRole = currentRole === "admin" ? "alumni" : "admin";
    if (!window.confirm(`Are you sure you want to change user role to ${nextRole}?`)) return;

    try {
      const res = await api.put(`/admin/role/${id}`, { role: nextRole });
      if (res.data.success) {
        alert("User role updated successfully!");
        fetchAdminData(); // Full refresh
      }
    } catch (error) {
      console.log("Error changing role", error);
      alert("Failed to toggle role");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action is irreversible.")) return;

    try {
      const res = await api.delete(`/admin/user/${id}`);
      if (res.data.success) {
        alert("User deleted successfully!");
        fetchAdminData(); // Full refresh
      }
    } catch (error) {
      console.log("Error deleting user", error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="loading-state">Accessing Admin records...</div>;
  }

  if (!adminData) {
    return <div className="empty-state">Access Denied / Admin Stats Error.</div>;
  }

  const { stats, pendingList, recentUsers, deptStats } = adminData;

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <ShieldCheck size={28} style={{ color: "var(--accent)" }} />
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>Admin Workspace</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>Verification queues, account configurations, and global usage logs.</p>
        </div>
      </div>

      {/* Analytics stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}><Users size={20} /></div>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalUsers}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Total Users</span>
          </div>
        </div>
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}><UserCheck size={20} /></div>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.verifiedAlumni}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Verified Alumni</span>
          </div>
        </div>
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B" }}><ShieldAlert size={20} /></div>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.pendingApprovals}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Pending Approval</span>
          </div>
        </div>
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}><Briefcase size={20} /></div>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalJobs}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Jobs Listed</span>
          </div>
        </div>
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}><Calendar size={20} /></div>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalEvents}</h4>
            <span style={{ fontSize: "12px", color: "var(--text-light)" }}>Active Events</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", gap: "24px", marginBottom: "24px" }}>
        <button 
          onClick={() => setActiveTab("queue")}
          style={{ 
            background: "none", border: "none", paddingBottom: "12px", fontSize: "16px", fontWeight: "600",
            color: activeTab === "queue" ? "var(--accent)" : "var(--text-light)",
            borderBottom: activeTab === "queue" ? "2px solid var(--accent)" : "none", cursor: "pointer"
          }}
        >
          Approvals Queue ({pendingList.length})
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          style={{ 
            background: "none", border: "none", paddingBottom: "12px", fontSize: "16px", fontWeight: "600",
            color: activeTab === "users" ? "var(--accent)" : "var(--text-light)",
            borderBottom: activeTab === "users" ? "2px solid var(--accent)" : "none", cursor: "pointer"
          }}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab("analytics")}
          style={{ 
            background: "none", border: "none", paddingBottom: "12px", fontSize: "16px", fontWeight: "600",
            color: activeTab === "analytics" ? "var(--accent)" : "var(--text-light)",
            borderBottom: activeTab === "analytics" ? "2px solid var(--accent)" : "none", cursor: "pointer"
          }}
        >
          Department Analytics
        </button>
      </div>

      {/* Content Panes */}
      <div className="admin-content-pane">
        {activeTab === "queue" && (
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)" }}>Pending Alumni Verification</h3>
            
            {pendingList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pendingList.map((user) => (
                  <div key={user._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-light)", backgroundColor: "var(--bg-hover)" }}>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-dark)" }}>{user.fullName}</h4>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                        <strong>Roll No:</strong> {user.rollNo} | <strong>Dept:</strong> {user.department} | <strong>Class:</strong> {user.graduationYear}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>Email: {user.email} | Phone: {user.phone}</p>
                    </div>
                    <button 
                      className="register-main-btn"
                      onClick={() => handleApproveUser(user._id)}
                      style={{ fontSize: "13px", padding: "8px 16px" }}
                    >
                      Verify / Approve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px", color: "var(--text-light)" }}>
                <UserCheck size={36} style={{ margin: "0 auto 12px auto" }} />
                <p>Approvals queue is clear! No pending registrations.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)" }}>Registered Platform Accounts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentUsers.map((user) => (
                <div key={user._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: "8px", border: "1px solid var(--border-light)", backgroundColor: "var(--bg-hover)" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)" }}>
                      {user.fullName}
                      {user.role === "admin" && <span style={{ marginLeft: "8px", fontSize: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "2px 6px", borderRadius: "10px", fontWeight: "600" }}>Admin</span>}
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{user.email} | {user.department || "No Dept"}</p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      className="view-profile-btn" 
                      onClick={() => handleToggleRole(user._id, user.role)}
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      <Shield size={12} /> {user.role === "admin" ? "Demote" : "Make Admin"}
                    </button>
                    <button 
                      className="view-profile-btn"
                      onClick={() => handleDeleteUser(user._id)}
                      style={{ padding: "6px 12px", fontSize: "12px", color: "var(--danger-text)", borderColor: "var(--danger-text)" }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}><BarChart3 size={20} /> Department Distribution</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {deptStats.map((item, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-dark)", fontWeight: "600" }}>
                    <span>{item._id || "Unspecified"}</span>
                    <span>{item.count} alumni</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", borderRadius: "4px", backgroundColor: "var(--bg-hover)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (item.count / stats.totalUsers) * 100)}%`, height: "100%", backgroundColor: "var(--accent)" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
