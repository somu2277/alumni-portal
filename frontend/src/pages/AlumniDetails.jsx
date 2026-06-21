import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Mail, Phone, Book, Calendar, Briefcase, Linkedin, Globe, Github,
  CheckCircle, ArrowLeft, MessageSquare, Download, Award, Share2
} from "lucide-react";
import { motion } from "framer-motion";
import "./Profile.css"; // Reuse profile stylesheet for visual consistency

function AlumniDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumniDetails();
  }, [id]);

  const fetchAlumniDetails = async () => {
    try {
      const res = await api.get(`/alumni/${id}`);
      setUser(res.data.alumni);
    } catch (error) {
      console.log("Error fetching alumni details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-skeleton" style={{ padding: "40px" }}>
        <div className="skeleton-cover" style={{ height: "200px", backgroundColor: "var(--bg-hover)", borderRadius: "var(--radius-lg)" }}></div>
        <div className="skeleton-avatar" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "var(--bg-hover)", marginTop: "-60px", marginLeft: "40px", border: "4px solid var(--bg-card)" }}></div>
        <div className="skeleton-text" style={{ width: "200px", height: "24px", backgroundColor: "var(--bg-hover)", marginTop: "20px", marginLeft: "40px" }}></div>
        <div className="skeleton-text" style={{ width: "300px", height: "18px", backgroundColor: "var(--bg-hover)", marginTop: "10px", marginLeft: "40px" }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-state" style={{ textAlign: "center", padding: "64px" }}>
        <h3>Alumni profile not found</h3>
        <button className="li-btn-primary" onClick={() => navigate("/directory")} style={{ marginTop: "16px" }}>
          <ArrowLeft size={16} /> Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="li-profile-container" style={{ padding: "24px 0" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", color: "var(--text-muted)", fontSize: "14px", fontWeight: "600", marginBottom: "16px", cursor: "pointer" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="li-profile-grid">
        {/* MAIN COLUMN */}
        <div className="li-main-column">
          
          {/* Header Card */}
          <div className="li-card profile-header-card">
            <div className="cover-photo-area" style={{ height: "200px" }}>
              {user.coverImage ? (
                <img src={user.coverImage} alt="Cover" className="cover-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="cover-placeholder" style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--primary), var(--accent))" }}></div>
              )}
            </div>
            
            <div className="profile-info-area">
              <div className="avatar-wrapper">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="profile-avatar" style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--bg-card)" }} />
                ) : (
                  <div className="profile-avatar placeholder" style={{ width: "130px", height: "130px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--accent)", color: "white", fontSize: "40px", fontWeight: "700", border: "4px solid var(--bg-card)" }}>
                    {user.fullName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="profile-actions-top">

                {user.resumeUrl && (
                  <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="li-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Download size={16} /> Download Resume
                  </a>
                )}
              </div>

              <div className="profile-text-content">
                <h1>
                  {user.fullName} 
                  {user.isVerified && <CheckCircle size={18} className="text-blue" style={{ display: "inline", marginLeft: "8px", color: "var(--accent)" }} />}
                </h1>
                <h2>{user.jobTitle || 'Alumni'} {user.company && `at ${user.company}`}</h2>
                <div className="profile-location">
                  <span>{user.department} • Class of {user.graduationYear}</span>
                  {user.location && (
                    <>
                      <span className="dot" style={{ margin: "0 8px" }}>•</span>
                      <span>{user.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>About</h2>
            {user.bio ? (
              <p className="about-text" style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>{user.bio}</p>
            ) : (
              <p className="empty-text" style={{ color: "var(--text-light)" }}>No summary provided.</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Experience</h2>
            {Array.isArray(user.experience) && user.experience.length > 0 ? (
              <div className="li-timeline">
                {user.experience.map((exp, idx) => (
                  <div className="timeline-item" key={idx} style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <div className="timeline-logo" style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      <Briefcase size={24} />
                    </div>
                    <div className="timeline-body">
                      <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{exp.role}</h3>
                      <h4 style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500", marginTop: "2px" }}>{exp.company}</h4>
                      <span className="date-range" style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginTop: "4px" }}>{exp.duration}</span>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text" style={{ color: "var(--text-light)" }}>No experience added.</p>
            )}
          </div>

          {/* Education Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Education</h2>
            <div className="li-timeline">
              <div className="timeline-item" style={{ display: "flex", gap: "16px" }}>
                <div className="timeline-logo" style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                  <Book size={24} />
                </div>
                <div className="timeline-body">
                  <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Alumni University</h3>
                  <h4 style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500", marginTop: "2px" }}>{user.department}</h4>
                  <span className="date-range" style={{ fontSize: "12px", color: "var(--text-light)", display: "block", marginTop: "4px" }}>Graduation: Class of {user.graduationYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Projects</h2>
            {Array.isArray(user.projects) && user.projects.length > 0 ? (
              <div className="project-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {user.projects.map((proj, idx) => (
                  <div className="project-item" key={idx} style={{ padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{proj.projectName}</h3>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>{proj.description}</p>
                    {proj.techStack && (
                      <p style={{ fontSize: "13px", color: "var(--text-light)", marginTop: "6px" }}>
                        <strong>Technologies:</strong> {proj.techStack}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--accent)", fontWeight: "600", marginTop: "8px" }}>
                        View Project <Share2 size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text" style={{ color: "var(--text-light)" }}>No projects added.</p>
            )}
          </div>

          {/* Achievements Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Honors & Awards</h2>
            {Array.isArray(user.achievements) && user.achievements.length > 0 ? (
              <div className="li-timeline">
                {user.achievements.map((ach, idx) => (
                  <div className="timeline-item" key={idx} style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                    <div className="timeline-logo" style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      <Award size={24} />
                    </div>
                    <div className="timeline-body">
                      <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{ach.title}</h3>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text" style={{ color: "var(--text-light)" }}>No honors or awards added.</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="li-card">
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Skills</h2>
            {Array.isArray(user.skills) && user.skills.length > 0 ? (
              <div className="li-skills-grid" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {user.skills.map((skill, idx) => (
                  <div className="li-skill-badge" key={idx} style={{ padding: "8px 16px", backgroundColor: "var(--bg-hover)", borderRadius: "20px", fontSize: "14px", fontWeight: "500", color: "var(--text-dark)" }}>
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text" style={{ color: "var(--text-light)" }}>No skills listed.</p>
            )}
          </div>

        </div>

        {/* SIDE COLUMN */}
        <div className="li-side-column">
          {/* Contact Details Card */}
          <div className="li-card">
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Contact Details</h3>
            <div className="social-links-area" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
                <Mail size={18} />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
                  <Phone size={18} />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--accent)", fontWeight: "600" }}>
                  <Linkedin size={18} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-dark)", fontWeight: "600" }}>
                  <Github size={18} />
                  <span>GitHub Profile</span>
                </a>
              )}
              {user.portfolio && (
                <a href={user.portfolio} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-dark)", fontWeight: "600" }}>
                  <Globe size={18} />
                  <span>Personal Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AlumniDetails;
