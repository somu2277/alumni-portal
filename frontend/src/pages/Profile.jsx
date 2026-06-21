import { useEffect, useState } from "react";
import api from "../api";
import { 
  Mail, Phone, Book, Calendar, Briefcase, Linkedin, Globe, Github,
  CheckCircle, Edit3, MapPin, Share2, Download, Plus, Trash2, X, Award,
  Camera, UploadCloud, FileText, Check, ChevronRight, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", rollNo: "", department: "", graduationYear: "",
    company: "", jobTitle: "", linkedin: "", github: "", portfolio: "", bio: "", resumeUrl: "", coverImage: "", profileImage: "",
    skills: [], experience: [], projects: [], achievements: []
  });

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setFormData({
          ...res.data.user,
          skills: Array.isArray(res.data.user.skills) ? res.data.user.skills : [],
          experience: Array.isArray(res.data.user.experience) ? res.data.user.experience : [],
          projects: Array.isArray(res.data.user.projects) ? res.data.user.projects : [],
          achievements: Array.isArray(res.data.user.achievements) ? res.data.user.achievements : []
        });
        calculateCompletion(res.data.user);
      }
    } catch (error) {
      console.log("Could not fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (userData) => {
    const fieldsToCheck = [
      { key: 'bio', label: 'About Summary' },
      { key: 'skills', label: 'Skills', isArray: true },
      { key: 'experience', label: 'Experience', isArray: true },
      { key: 'resumeUrl', label: 'Resume' },
      { key: 'linkedin', label: 'LinkedIn Profile' },
      { key: 'profileImage', label: 'Profile Picture' },
    ];

    let completed = 0;
    let missing = [];

    fieldsToCheck.forEach(field => {
      if (field.isArray) {
        if (userData[field.key] && userData[field.key].length > 0) completed++;
        else missing.push(field.label);
      } else {
        if (userData[field.key]) completed++;
        else missing.push(field.label);
      }
    });

    setProfileCompletion(Math.round((completed / fieldsToCheck.length) * 100));
    setMissingFields(missing);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][subfield] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData({ ...formData, [field]: [...formData[field], emptyItem] });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== "");
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile", formData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsEditing(false);
        calculateCompletion(res.data.user);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.log("Could not update profile", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-skeleton">
        <div className="skeleton-cover"></div>
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text line-1"></div>
        <div className="skeleton-text line-2"></div>
      </div>
    );
  }

  if (!user) return <div className="empty-state">Profile not found.</div>;

  return (
    <div className="li-profile-container">
      <div className="li-profile-grid">
        {/* LEFT COLUMN */}
        <div className="li-main-column">
          
          {/* Top Header Card */}
          <div className="li-card profile-header-card">
            <div className="cover-photo-area">
              {user.coverImage ? (
                <img src={user.coverImage} alt="Cover" className="cover-img" />
              ) : (
                <div className="cover-placeholder"></div>
              )}
              <button className="edit-cover-btn" onClick={() => {setIsEditing(true); setActiveTab("uploads");}}>
                <Camera size={16} /> Edit Cover
              </button>
            </div>
            
            <div className="profile-info-area">
              <div className="avatar-wrapper">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar placeholder">{user.fullName?.charAt(0)}</div>
                )}
                <button className="edit-avatar-btn" onClick={() => {setIsEditing(true); setActiveTab("uploads");}}>
                  <Camera size={16} />
                </button>
              </div>

              <div className="profile-actions-top">
                <button className="li-btn-primary" onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} /> Edit Profile
                </button>
                {user.resumeUrl && (
                  <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="li-btn-secondary">
                    <Download size={16} /> Resume
                  </a>
                )}
                <button className="li-btn-icon"><Share2 size={16} /></button>
              </div>

              <div className="profile-text-content">
                <h1>{user.fullName} {user.isVerified && <CheckCircle size={18} className="text-blue" />}</h1>
                <h2>{user.jobTitle || 'Alumni'} {user.company && `at ${user.company}`}</h2>
                <div className="profile-location">
                  <span>{user.department} • Class of {user.graduationYear}</span>
                  <span className="dot">•</span>
                  <a href="#contact" className="contact-link">Contact info</a>
                </div>
                {user.company && (
                  <div className="current-company-badge">
                    <Briefcase size={16} />
                    <span>{user.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>About</h2>
              <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("personal");}}><Edit3 size={20}/></button>
            </div>
            {user.bio ? (
              <p className="about-text">{user.bio}</p>
            ) : (
              <p className="empty-text">No summary provided.</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>Experience</h2>
              <div className="card-actions">
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("experience"); addArrayItem("experience", {company:"", role:"", duration:"", description:""});}}><Plus size={24}/></button>
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("experience");}}><Edit3 size={20}/></button>
              </div>
            </div>
            
            {Array.isArray(user.experience) && user.experience.length > 0 ? (
              <div className="li-timeline">
                {user.experience.map((exp, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-logo"><Briefcase size={24} /></div>
                    <div className="timeline-body">
                      <h3>{exp.role}</h3>
                      <h4>{exp.company}</h4>
                      <span className="date-range">{exp.duration}</span>
                      <p>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No experience added.</p>
            )}
          </div>

          {/* Education Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>Education</h2>
              <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("personal");}}><Edit3 size={20}/></button>
            </div>
            <div className="li-timeline">
              <div className="timeline-item">
                <div className="timeline-logo"><Book size={24} /></div>
                <div className="timeline-body">
                  <h3>University Name</h3>
                  <h4>{user.department}</h4>
                  <span className="date-range">Graduated: {user.graduationYear}</span>
                  <p>Roll No: {user.rollNo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>Projects</h2>
              <div className="card-actions">
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("projects"); addArrayItem("projects", {projectName:"", link:"", description:"", techStack:""});}}><Plus size={24}/></button>
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("projects");}}><Edit3 size={20}/></button>
              </div>
            </div>
            {Array.isArray(user.projects) && user.projects.length > 0 ? (
              <div className="project-list">
                {user.projects.map((proj, idx) => (
                  <div className="project-item" key={idx}>
                    <h3>{proj.projectName}</h3>
                    <p className="project-desc">{proj.description}</p>
                    {proj.techStack && <p className="project-tech"><strong>Tech Stack:</strong> {proj.techStack}</p>}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">
                        Show project <Share2 size={14}/>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No projects added.</p>
            )}
          </div>

          {/* Achievements Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>Honors & Awards</h2>
              <div className="card-actions">
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("projects"); addArrayItem("achievements", {title:"", description:""});}}><Plus size={24}/></button>
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("projects");}}><Edit3 size={20}/></button>
              </div>
            </div>
            {Array.isArray(user.achievements) && user.achievements.length > 0 ? (
              <div className="li-timeline">
                {user.achievements.map((ach, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-logo"><Award size={24} /></div>
                    <div className="timeline-body">
                      <h3>{ach.title}</h3>
                      <p>{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No honors or awards added.</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="li-card">
            <div className="card-header-flex">
              <h2>Skills</h2>
              <div className="card-actions">
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("professional");}}><Plus size={24}/></button>
                <button className="li-btn-icon-ghost" onClick={() => {setIsEditing(true); setActiveTab("professional");}}><Edit3 size={20}/></button>
              </div>
            </div>
            {Array.isArray(user.skills) && user.skills.length > 0 ? (
              <div className="li-skills-grid">
                {user.skills.map((skill, idx) => (
                  <div className="li-skill-badge" key={idx}>
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No skills added.</p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="li-side-column">
          
          {/* Profile Completion Card */}
          <div className="li-card completion-card">
            <h3>Profile Completion</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <p className="completion-text">{profileCompletion}% Complete</p>
            
            {Array.isArray(missingFields) && missingFields.length > 0 && (
              <div className="missing-fields">
                <p>Missing:</p>
                <ul>
                  {missingFields.map((f, i) => (
                    <li key={i}><CheckCircle size={14} color="#94a3b8"/> {f}</li>
                  ))}
                </ul>
                <button className="li-btn-text" onClick={() => setIsEditing(true)}>Add missing details</button>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="li-card">
            <h3>Connect</h3>
            <div className="social-links-area">
              <a href={`mailto:${user.email}`} className="social-row"><Mail size={18}/> {user.email}</a>
              {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="social-row"><Linkedin size={18}/> LinkedIn</a>}
              {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="social-row"><Github size={18}/> GitHub</a>}
              {user.portfolio && <a href={user.portfolio} target="_blank" rel="noreferrer" className="social-row"><Globe size={18}/> Portfolio</a>}
            </div>
          </div>

          {/* Activity Section */}
          <div className="li-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {Array.isArray(user.appliedJobs) && user.appliedJobs.length > 0 && user.appliedJobs.map((job, idx) => job && (
                <div className="activity-item" key={`job-${idx}`}>
                  <span className="dot bg-blue"></span>
                  <p>Applied for <strong>{job.role}</strong> at {job.company}</p>
                </div>
              ))}
              {Array.isArray(user.attendedEvents) && user.attendedEvents.length > 0 && user.attendedEvents.map((ev, idx) => ev && (
                <div className="activity-item" key={`ev-${idx}`}>
                  <span className="dot bg-purple"></span>
                  <p>Registered for <strong>{ev.title}</strong></p>
                </div>
              ))}
              {(!Array.isArray(user.appliedJobs) || user.appliedJobs.length === 0) && (!Array.isArray(user.attendedEvents) || user.attendedEvents.length === 0) && (
                <div className="activity-item">
                  <span className="dot bg-blue"></span>
                  <p>Updated profile details</p>
                </div>
              )}
            </div>
            <button className="li-btn-text mt-3">Show all activity <ArrowRight size={14}/></button>
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="li-modal-overlay">
          <div className="li-modal">
            <div className="li-modal-header">
              <h2>Edit Profile</h2>
              <button className="li-close-btn" onClick={() => setIsEditing(false)}><X size={24}/></button>
            </div>
            
            <div className="li-modal-tabs">
              <button className={activeTab==="personal"?"active":""} onClick={()=>setActiveTab("personal")}>Personal</button>
              <button className={activeTab==="professional"?"active":""} onClick={()=>setActiveTab("professional")}>Professional & Skills</button>
              <button className={activeTab==="experience"?"active":""} onClick={()=>setActiveTab("experience")}>Experience</button>
              <button className={activeTab==="projects"?"active":""} onClick={()=>setActiveTab("projects")}>Projects & Awards</button>
              <button className={activeTab==="uploads"?"active":""} onClick={()=>setActiveTab("uploads")}>Uploads</button>
            </div>

            <form onSubmit={handleSubmit} className="li-modal-body">
              {activeTab === "personal" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input type="number" name="graduationYear" value={formData.graduationYear || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Department</label>
                    <input type="text" name="department" value={formData.department || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>About / Bio</label>
                    <textarea name="bio" value={formData.bio || ""} onChange={handleInputChange} rows="4" placeholder="Write a summary about yourself..."></textarea>
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Current Job Title</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Current Company</label>
                    <input type="text" name="company" value={formData.company || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Skills (Comma separated)</label>
                    <input type="text" value={formData.skills ? formData.skills.join(", ") : ""} onChange={handleSkillsChange} placeholder="e.g. React, Node.js, Python" />
                  </div>
                  <div className="form-group full-width">
                    <label>LinkedIn URL</label>
                    <input type="url" name="linkedin" value={formData.linkedin || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>GitHub URL</label>
                    <input type="url" name="github" value={formData.github || ""} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Portfolio Website URL</label>
                    <input type="url" name="portfolio" value={formData.portfolio || ""} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div className="nested-forms">
                  {formData.experience.map((exp, idx) => (
                    <div className="nested-card" key={idx}>
                      <div className="nested-header">
                        <h4>Experience {idx+1}</h4>
                        <button type="button" onClick={()=>removeArrayItem("experience", idx)}><Trash2 size={18}/></button>
                      </div>
                      <input type="text" placeholder="Title (e.g. Software Engineer)" value={exp.role} onChange={(e)=>handleArrayChange("experience",idx,"role",e.target.value)} />
                      <input type="text" placeholder="Company Name" value={exp.company} onChange={(e)=>handleArrayChange("experience",idx,"company",e.target.value)} />
                      <input type="text" placeholder="Duration (e.g. Jan 2020 - Present)" value={exp.duration} onChange={(e)=>handleArrayChange("experience",idx,"duration",e.target.value)} />
                      <textarea placeholder="Description of your work" rows="3" value={exp.description} onChange={(e)=>handleArrayChange("experience",idx,"description",e.target.value)}></textarea>
                    </div>
                  ))}
                  <button type="button" className="add-nested-btn" onClick={() => addArrayItem("experience", {company:"", role:"", duration:"", description:""})}>
                    <Plus size={18}/> Add Experience
                  </button>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="nested-forms">
                  <h3>Projects</h3>
                  {formData.projects.map((proj, idx) => (
                    <div className="nested-card" key={idx}>
                      <div className="nested-header">
                        <h4>Project {idx+1}</h4>
                        <button type="button" onClick={()=>removeArrayItem("projects", idx)}><Trash2 size={18}/></button>
                      </div>
                      <input type="text" placeholder="Project Name" value={proj.projectName} onChange={(e)=>handleArrayChange("projects",idx,"projectName",e.target.value)} />
                      <input type="text" placeholder="Tech Stack (e.g. MERN, AWS)" value={proj.techStack || ""} onChange={(e)=>handleArrayChange("projects",idx,"techStack",e.target.value)} />
                      <input type="url" placeholder="Project URL" value={proj.link} onChange={(e)=>handleArrayChange("projects",idx,"link",e.target.value)} />
                      <textarea placeholder="Description" rows="2" value={proj.description} onChange={(e)=>handleArrayChange("projects",idx,"description",e.target.value)}></textarea>
                    </div>
                  ))}
                  <button type="button" className="add-nested-btn" onClick={() => addArrayItem("projects", {projectName:"", techStack:"", link:"", description:""})}>
                    <Plus size={18}/> Add Project
                  </button>

                  <h3 className="mt-4">Honors & Awards</h3>
                  {formData.achievements.map((ach, idx) => (
                    <div className="nested-card" key={idx}>
                      <div className="nested-header">
                        <h4>Award {idx+1}</h4>
                        <button type="button" onClick={()=>removeArrayItem("achievements", idx)}><Trash2 size={18}/></button>
                      </div>
                      <input type="text" placeholder="Award Title" value={ach.title} onChange={(e)=>handleArrayChange("achievements",idx,"title",e.target.value)} />
                      <textarea placeholder="Description" rows="2" value={ach.description} onChange={(e)=>handleArrayChange("achievements",idx,"description",e.target.value)}></textarea>
                    </div>
                  ))}
                  <button type="button" className="add-nested-btn" onClick={() => addArrayItem("achievements", {title:"", description:""})}>
                    <Plus size={18}/> Add Award
                  </button>
                </div>
              )}

              {activeTab === "uploads" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Profile Picture URL</label>
                    <input type="url" name="profileImage" value={formData.profileImage || ""} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                  <div className="form-group full-width">
                    <label>Cover Photo URL</label>
                    <input type="url" name="coverImage" value={formData.coverImage || ""} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                  <div className="form-group full-width">
                    <label>Resume (PDF URL)</label>
                    <div className="upload-box">
                      <FileText size={32} color="#94a3b8" />
                      <p>Enter the public URL of your hosted resume.</p>
                      <input type="url" name="resumeUrl" value={formData.resumeUrl || ""} onChange={handleInputChange} placeholder="https://drive.google.com/..." />
                    </div>
                  </div>
                </div>
              )}

              <div className="li-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;