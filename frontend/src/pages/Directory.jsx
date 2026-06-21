import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Search, MapPin, Briefcase, GraduationCap, Link as LinkIcon, UserPlus, Filter, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "./Directory.css";

function Directory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search from header search parameter
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      setSearch(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAlumni();
    // Reset page to 1 if filters change, but avoid infinite loops
  }, [search, department, batch, location, company, sortBy, sortOrder, page]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await api.get("/alumni", {
        params: {
          search,
          department,
          graduationYear: batch,
          location,
          company,
          sortBy,
          sortOrder,
          page,
          limit: 8,
        },
      });
      setAlumni(res.data.alumni || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (error) {
      console.log("Error fetching directory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("");
    setBatch("");
    setLocation("");
    setCompany("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="directory-page">
      <div className="page-header">
        <div>
          <h1>Alumni Directory</h1>
          <p>Discover and connect with your fellow alumni across the globe.</p>
        </div>
      </div>

      <div className="directory-toolbar" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <div className="search-bar" style={{ flexGrow: 1 }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name, company, graduation..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button 
            className={`filter-btn ${showFilters ? "active" : ""}`} 
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "var(--radius-md)" }}
          >
            <Filter size={16} /> Filters
          </button>
          
          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [by, order] = e.target.value.split("-");
              setSortBy(by);
              setSortOrder(order);
              setPage(1);
            }}
            style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", outline: "none", cursor: "pointer" }}
          >
            <option value="createdAt-desc">Newest Joined</option>
            <option value="fullName-asc">Name (A-Z)</option>
            <option value="fullName-desc">Name (Z-A)</option>
            <option value="graduationYear-desc">Class Year (Newest)</option>
            <option value="graduationYear-asc">Class Year (Oldest)</option>
          </select>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", padding: "20px", marginTop: "8px" }}
          >
            <div className="filter-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Department</label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science" 
                value={department} 
                onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div className="filter-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Graduation Year</label>
              <input 
                type="number" 
                placeholder="e.g. 2022" 
                value={batch} 
                onChange={(e) => { setBatch(e.target.value); setPage(1); }}
                style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div className="filter-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Location</label>
              <input 
                type="text" 
                placeholder="e.g. San Francisco" 
                value={location} 
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div className="filter-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Company / Industry</label>
              <input 
                type="text" 
                placeholder="e.g. Google" 
                value={company} 
                onChange={(e) => { setCompany(e.target.value); setPage(1); }}
                style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button 
                onClick={handleClearFilters}
                style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border-strong)", background: "transparent", fontWeight: "600", color: "var(--text-muted)" }}
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Loading directory...</div>
      ) : (
        <>
          <div className="directory-grid">
            {alumni.length > 0 ? alumni.map((user, index) => (
              <motion.div
                key={user._id}
                className="alumni-profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => navigate(`/directory/${user._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-cover-photo" style={{ backgroundImage: user.coverImage ? `url(${user.coverImage})` : "none" }}></div>
                <div className="card-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    user.fullName?.charAt(0)
                  )}
                </div>
                
                <div className="card-info">
                  <h2>{user.fullName}</h2>
                  <p className="job-title">
                    <Briefcase size={14} /> 
                    {user.jobTitle || "Alumni"} {user.company ? `at ${user.company}` : ""}
                  </p>
                  <p className="education-info">
                    <GraduationCap size={14} /> 
                    {user.department} • Class of {user.graduationYear}
                  </p>
                  {user.location && (
                    <p className="location-info" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                      <MapPin size={14} /> {user.location}
                    </p>
                  )}
                </div>

                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="connect-btn"
                    onClick={() => {
                      navigate(`/directory/${user._id}`);
                    }}
                  >
                    View Profile
                  </button>
                  {user.linkedin && (
                    <button className="linkedin-btn" onClick={() => window.open(user.linkedin, '_blank')}>
                      <LinkIcon size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="no-results-state" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px" }}>
                <Users size={48} className="empty-icon" style={{ margin: "0 auto 16px auto", color: "var(--text-light)" }} />
                <h3>No alumni found</h3>
                <p>Try adjusting your search query or filters</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" }}>
              <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", backgroundColor: page === 1 ? "var(--bg-hover)" : "var(--bg-card)", color: "var(--text-dark)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", backgroundColor: page === totalPages ? "var(--bg-hover)" : "var(--bg-card)", color: "var(--text-dark)", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Directory;