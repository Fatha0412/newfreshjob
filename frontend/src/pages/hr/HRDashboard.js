import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaPlus, FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/shared.css";

const HRDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      // ✅ THE FINAL FIX: Using the absolute URL to bypass the /v1/ ghost
      const res = await api.get("https://freshjob-wb5m.onrender.com/api/jobs/my-jobs");
      setJobs(res.data || []);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;
  // Added a fallback to 0 in case applicationsCount is missing
  const totalApplications = jobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>HR Dashboard</h1>
          <p>Welcome back, {user.name} - {user.company}</p>
        </div>
        <Link to="/hr/post-job" className="btn btn-primary">
          <FaPlus /> Post New Job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--primary)" }}>
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>{jobs.length}</h3>
            <p>Total Jobs Posted</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--success)" }}>
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--danger)" }}>
            <FaTimesCircle />
          </div>
          <div className="stat-info">
            <h3>{closedJobs}</h3>
            <p>Closed Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--warning)" }}>
            <FaFileAlt />
          </div>
          <div className="stat-info">
            <h3>{totalApplications}</h3>
            <p>Total Applications</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Your Job Listings</h2>
          <Link to="/hr/my-jobs" className="btn btn-sm btn-outline">View All</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div className="spinner" style={{ margin: "0 auto" }}></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <FaBriefcase style={{ fontSize: "3rem", color: "var(--gray-300)" }} />
            <h3>No jobs posted yet</h3>
            <p>Start by posting your first job listing</p>
            <Link to="/hr/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>
              <FaPlus /> Post a Job
            </Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.slice(0, 6).map((job) => (
              <Link to={`/hr/applications/${job._id}`} key={job._id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <span className={`status-badge status-${job.status}`}>{job.status}</span>
                </div>
                <div className="job-meta">
                  <span>{job.location}</span>
                  <span>{job.type}</span>
                  <span>{job.applicationsCount || 0} applications</span>
                </div>
                <div className="job-skills">
                  {/* Safety check added here with ?. */}
                  {job.skillsRequired?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;