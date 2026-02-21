import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/shared.css";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("https://freshjob-wb5m.onrender.com/api/jobs/my-jobs");
      setJobs(res.data);
    } catch (error) {
      toast.error("Error fetching jobs");
      setJobs([]); // Defensive: set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      // ✅ Fixed: Absolute URL for DELETE request
      await api.delete(`https://freshjob-wb5m.onrender.com/api/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error deleting job");
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      // ✅ Fixed: Absolute URL for PUT request
      await api.put(`https://freshjob-wb5m.onrender.com/api/jobs/${jobId}`, { status: newStatus });
      toast.success(`Job ${newStatus}`);
      fetchJobs();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Error updating job");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>My Job Listings</h1>
          <p>Manage all your posted jobs</p>
        </div>
        <Link to="/hr/post-job" className="btn btn-primary">
          <FaPlus /> Post New Job
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : Array.isArray(jobs) && jobs.length === 0 ? (
        <div className="empty-state card">
          <h3>No jobs posted yet</h3>
          <p>Start by posting your first job listing</p>
          <Link to="/hr/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>
            <FaPlus /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {Array.isArray(jobs) && jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                </div>
                <span className={`status-badge status-${job.status}`}>{job.status}</span>
              </div>

              <div className="job-meta">
                <span><FaMapMarkerAlt /> {job.location}</span>
                <span>{job.type}</span>
                <span><FaUsers /> {job.applicationsCount} applicants</span>
              </div>

              <div className="job-skills">
                {/* ✅ Added safety check (?.) to prevent crashes if skills are missing */}
                {job.skillsRequired?.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--gray-200)" }}>
                <Link to={`/hr/applications/${job._id}`} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                  <FaEye /> Applications
                </Link>
                <button
                  className={`btn btn-sm ${job.status === "active" ? "btn-warning" : "btn-success"}`}
                  onClick={() => toggleStatus(job._id, job.status)}
                >
                  <FaEdit /> {job.status === "active" ? "Close" : "Reopen"}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job._id, job.title)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;