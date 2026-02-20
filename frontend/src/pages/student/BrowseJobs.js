import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/shared.css";

const BrowseJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ Using absolute URLs for BOTH to bypass the /v1/ mismatch that causes 404s
      const [jobsRes, appsRes] = await Promise.all([
        api.get("http://localhost:5000/api/jobs"),
        api.get("http://localhost:5000/api/applications/my-applications"),
      ]);
      setJobs(jobsRes.data);
      setAppliedJobs(appsRes.data ? appsRes.data.map((a) => a.job?._id) : []);
    } catch (error) {
      console.error("Fetch error:", error);
      
      // Fallback: If applications fail but jobs are available, try to at least show jobs
      try {
        const jobsOnly = await api.get("http://localhost:5000/api/jobs");
        setJobs(jobsOnly.data);
      } catch (err) {
        toast.error("Could not connect to the server. Please ensure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user?.resume) {
      toast.warning("Please upload your resume first from your Profile page");
      return;
    }
    setApplying(true);
    try {
      // ✅ Using absolute URL for Application POST
      await api.post(`http://localhost:5000/api/applications/${jobId}`);
      toast.success("Applied successfully!");
      setAppliedJobs([...appliedJobs, jobId]);
      fetchData();
    } catch (error) {
      console.error("Apply error:", error);
      toast.error(error.response?.data?.message || "Error applying");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!job) return false;
    const matchesSearch =
      (job.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (job.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (job.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const isApplied = (jobId) => appliedJobs.includes(jobId);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Find and apply to your dream job with one click</p>
      </div>

      <div className="search-bar">
        <div style={{ position: "relative", flex: 1 }}>
          <FaSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, company, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <select className="form-control" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state card">
          <FaBriefcase style={{ fontSize: "3rem", color: "var(--gray-300)" }} />
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr 1fr" : "1fr", gap: "24px" }}>
          <div className="jobs-grid" style={{ gridTemplateColumns: selectedJob ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))" }}>
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="job-card"
                onClick={() => setSelectedJob(job)}
                style={{
                  borderColor: selectedJob?._id === job._id ? "var(--primary)" : undefined,
                  background: selectedJob?._id === job._id ? "rgba(79,70,229,0.02)" : undefined,
                  cursor: "pointer"
                }}
              >
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <span className={`job-type-badge ${(job.type || "").toLowerCase().replace(" ", "-")}`}>
                    {job.type}
                  </span>
                </div>
                <div className="job-meta">
                  <span><FaMapMarkerAlt /> {job.location}</span>
                  <span><FaMoneyBillWave /> {job.salary}</span>
                  <span><FaClock /> {job.experience}</span>
                </div>
                <div className="job-skills">
                  {(job.skillsRequired || []).slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--gray-200)" }}>
                  {isApplied(job._id) ? (
                    <button className="btn btn-sm btn-success" disabled style={{ width: "100%" }}>
                      <FaCheckCircle /> Applied
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ width: "100%" }}
                      onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                      disabled={applying}
                    >
                      <FaPaperPlane /> Easy Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedJob && (
            <div className="card" style={{ position: "sticky", top: "80px", alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "4px" }}>{selectedJob.title}</h2>
                  <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: "1.05rem" }}>{selectedJob.company}</p>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => setSelectedJob(null)}>✕</button>
              </div>

              <div className="job-meta" style={{ marginBottom: "20px" }}>
                <span><FaMapMarkerAlt /> {selectedJob.location}</span>
                <span><FaMoneyBillWave /> {selectedJob.salary}</span>
                <span><FaClock /> {selectedJob.experience}</span>
                <span><FaBriefcase /> {selectedJob.openings} opening(s)</span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "8px", color: "var(--gray-800)" }}>Description</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-600)", whiteSpace: "pre-line" }}>{selectedJob.description}</p>
              </div>

              {selectedJob.requirements?.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: 700, marginBottom: "8px", color: "var(--gray-800)" }}>Requirements</h4>
                  <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} style={{ fontSize: "0.9rem", color: "var(--gray-600)", marginBottom: "4px" }}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "8px", color: "var(--gray-800)" }}>Skills Required</h4>
                <div className="job-skills">
                  {(selectedJob.skillsRequired || []).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              {selectedJob.deadline && (
                <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "20px" }}>
                  Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
                </p>
              )}

              {isApplied(selectedJob._id) ? (
                <button className="btn btn-success btn-lg" disabled style={{ width: "100%" }}>
                  <FaCheckCircle /> Already Applied
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={applying}
                >
                  <FaPaperPlane /> {applying ? "Applying..." : "Easy Apply Now"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;