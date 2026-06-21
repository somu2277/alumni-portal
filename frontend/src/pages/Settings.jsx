import { useState, useEffect } from "react";
import api from "../api";
import { Shield, Moon, Sun, Key, LogOut, User, Bell } from "lucide-react";
import { motion } from "framer-motion";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  // Change Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match!");
    }
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters long!");
    }

    setPasswordLoading(true);
    try {
      const res = await api.post("/auth/change-password", {
        oldPassword,
        newPassword
      });
      if (res.data.success) {
        alert("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 0" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>Settings</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>Manage your account security, theme preferences, and configurations.</p>
      </div>

      <div style={{ display: "flex", gap: "32px", minHeight: "450px" }}>
        {/* Left Side Navigation tabs */}
        <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            onClick={() => setActiveTab("account")}
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "8px",
              backgroundColor: activeTab === "account" ? "var(--primary-light)" : "transparent",
              color: activeTab === "account" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none", textAlign: "left"
            }}
          >
            <User size={18} /> Account Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "8px",
              backgroundColor: activeTab === "security" ? "var(--primary-light)" : "transparent",
              color: activeTab === "security" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none", textAlign: "left"
            }}
          >
            <Shield size={18} /> Password & Security
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "8px",
              backgroundColor: activeTab === "theme" ? "var(--primary-light)" : "transparent",
              color: activeTab === "theme" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none", textAlign: "left"
            }}
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />} Theme Mode
          </button>
        </div>

        {/* Right Side Pane Content */}
        <div style={{ flexGrow: 1 }} className="card">
          {activeTab === "account" && (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)" }}>Account Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginBottom: "4px" }}>Full Name</label>
                    <input type="text" value={currentUser.fullName || ""} readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-main)", color: "var(--text-dark)", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginBottom: "4px" }}>Email Address</label>
                    <input type="text" value={currentUser.email || ""} readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-main)", color: "var(--text-dark)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginBottom: "4px" }}>Department</label>
                    <input type="text" value={currentUser.department || ""} readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-main)", color: "var(--text-dark)", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginBottom: "4px" }}>Graduation Year</label>
                    <input type="text" value={currentUser.graduationYear || ""} readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-main)", color: "var(--text-dark)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)", backgroundColor: "var(--primary-light)", fontSize: "13px", color: "var(--text-muted)", marginTop: "12px" }}>
                  <strong>Note:</strong> Profile records (such as Department, Graduation Year, and Name) are linked directly to your alumni registration card. To update these details, please edit your information in the Profile tab.
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}><Key size={20} /> Change Password</h2>
              <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)" }}>Current Password *</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", outline: "none", backgroundColor: "var(--bg-card)", color: "var(--text-dark)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)" }}>New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", outline: "none", backgroundColor: "var(--bg-card)", color: "var(--text-dark)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)" }}>Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-strong)", outline: "none", backgroundColor: "var(--bg-card)", color: "var(--text-dark)" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    alignSelf: "flex-start", backgroundColor: "var(--accent)", color: "white", padding: "10px 24px",
                    borderRadius: "6px", fontWeight: "600", cursor: "pointer", border: "none", marginTop: "8px"
                  }}
                >
                  {passwordLoading ? "Saving changes..." : "Update Password"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "theme" && (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--text-dark)" }}>Theme Mode</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Select your visual theme preference for the Alumni Portal interface.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div 
                  onClick={() => handleThemeChange("light")}
                  style={{ 
                    padding: "24px", borderRadius: "12px", border: theme === "light" ? "2px solid var(--accent)" : "1px solid var(--border-strong)",
                    cursor: "pointer", textAlign: "center", backgroundColor: "white", color: "black", boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <Sun size={32} style={{ color: "#F59E0B", margin: "0 auto 12px auto" }} />
                  <span style={{ fontWeight: "700", display: "block" }}>Light Mode</span>
                  <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginTop: "4px" }}>Standard light backgrounds with blue accents.</span>
                </div>

                <div 
                  onClick={() => handleThemeChange("dark")}
                  style={{ 
                    padding: "24px", borderRadius: "12px", border: theme === "dark" ? "2px solid var(--accent)" : "1px solid var(--border-strong)",
                    cursor: "pointer", textAlign: "center", backgroundColor: "#151C2C", color: "white", boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <Moon size={32} style={{ color: "#3B82F6", margin: "0 auto 12px auto" }} />
                  <span style={{ fontWeight: "700", display: "block" }}>Dark Mode</span>
                  <span style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginTop: "4px" }}>Sleek dark theme optimized for low-light environments.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
