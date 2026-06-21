import { useEffect, useState } from "react";
import api from "../api";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Trash2,
  Plus,
  X,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [appliedJobs, setAppliedJobs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    description: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/jobs/applied");
      if (res.data.success) {
        setAppliedJobs(res.data.appliedJobs || []);
      }
    } catch (err) {
      console.log("Error fetching applied jobs", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      postedBy: currentUser.fullName || "Alumni",
    };

    try {
      const res = await api.post("/jobs", dataToSubmit);

      if (res.data.success) {
        setJobs((prev) => [res.data.job, ...prev]);
        setShowModal(false);
        setFormData({
          company: "",
          role: "",
          location: "",
          salary: "",
          description: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- APPLY JOB ----------------
  const handleApply = async (job) => {
    const alreadyApplied = appliedJobs.some((j) => j._id === job._id);
    if (alreadyApplied) return;

    try {
      const res = await api.post(`/jobs/${job._id}/apply`);
      if (res.data.success) {
        setAppliedJobs((prev) => [...prev, job]);
      }
    } catch (err) {
      console.log("Error applying to job", err);
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  // ---------------- FILTER OPTIONS ----------------
  const availableRoles = [...new Set(jobs.map((j) => j.role).filter(Boolean))];
  const availableLocations = [...new Set(jobs.map((j) => j.location).filter(Boolean))];

  // ---------------- FILTER LOGIC ----------------
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? job.role === roleFilter : true;

    const matchesLocation = locationFilter ? job.location === locationFilter : true;

    return matchesSearch && matchesRole && matchesLocation;
  });

  return (
    <div className="jobs-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Job Opportunities</h1>
          <p>Explore opportunities from alumni network</p>
        </div>

        <button className="post-job-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Post Job
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="jobs-toolbar">

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search role or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="filter-btn"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <Filter size={16} /> Apply Filter
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilterPanel && (
        <div className="filter-panel">

          <div className="filter-group">
            <label>Role</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              {availableRoles.map((role, i) => (
                <option key={i} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {availableLocations.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setLocationFilter("");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* JOB LIST */}
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <motion.div key={job._id} className="job-card">

              <div className="job-header">
                <div className="company-logo">
                  {job.company?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h2>{job.role}</h2>
                  <p>{job.company}</p>
                </div>

                {currentUser.role === "admin" && (
                  <button onClick={() => handleDelete(job._id)}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="job-details">
                <span><MapPin size={14} /> {job.location || "Remote"}</span>
                <span><DollarSign size={14} /> {job.salary}</span>
                <span><Clock size={14} /> Full-time</span>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-footer">
                <span>Posted by {job.postedBy}</span>

                <button
                  className="apply-btn"
                  onClick={() => handleApply(job)}
                  disabled={appliedJobs.some((j) => j._id === job._id)}
                >
                  {appliedJobs.some((j) => j._id === job._id)
                    ? "Applied"
                    : "Apply Now"}
                </button>
              </div>

            </motion.div>
          ))
        ) : (
          <div className="no-jobs">No jobs found</div>
        )}
      </div>

      {/* APPLIED JOBS SECTION */}
      <div className="applied-section">
        <h2>Applied Jobs</h2>

        {appliedJobs.length === 0 ? (
          <p className="empty-applied">No jobs applied yet</p>
        ) : (
          <div className="applied-grid">
            {appliedJobs.map((job) => (
              <div key={job._id} className="applied-card">
                <h3>{job.role}</h3>
                <p>{job.company}</p>
                <span>{job.location || "Remote"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h2>Post Job</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleCreate} className="modal-form">

              <input name="role" placeholder="Role" value={formData.role} onChange={handleInputChange} required />
              <input name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} required />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
              <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">Post Job</button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Jobs;