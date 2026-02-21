import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaFileAlt, FaCloudUploadAlt, FaSearch, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/shared.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ Using absolute URLs to bypass the /v1/ mismatch
      const [appsRes, jobsRes] = await Promise.all([
        api.get("https://freshjob-wb5m.onrender.com/api/applications/my-applications"),
        api.get("https://freshjob-wb5m.onrender.com/api/jobs"),
      ]);
      
      setApplications(appsRes.data || []);
      // ✅ Removed the .slice(0,4) so you get the REAL total count of jobs
      setRecentJobs(jobsRes.data || []); 
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const appliedCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === "shortlisted").length;
  const selectedCount = applications.filter((a) => a.status === "selected").length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome, {user.name}!</h1>
        <p>Your job search dashboard</p>
      </div>

      {/* Resume Alert */}
      {!user.resume && (
        <div style={{
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "var(--radius)",
          padding: "16px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FaCloudUploadAlt style={{ fontSize: "1.5rem", color: "var(--warning)" }} />
            <div>
              <p style={{ fontWeight: 600, color: "var(--gray-800)" }}>Upload your resume to start applying</p>
              <p style={{ fontSize: "0.85rem", color: "var(--gray-500)" }}>You need a resume to use the Easy Apply feature</p>
            </div>
          </div>
          <Link to="/student/profile" className="btn btn-warning btn-sm">
            <FaCloudUploadAlt /> Upload Resume
          </Link>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--primary)" }}>
            <FaFileAlt />
          </div>
          <div className="stat-info">
            <h3>{appliedCount}</h3>
            <p>Jobs Applied</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--warning)" }}>
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{shortlistedCount}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--success)" }}>
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{selectedCount}</h3>
            <p>Selected</p>
          </div>
        </div>
        
        {/* ✅ The jobs count will now be 100% accurate */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--secondary)" }}>
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>{recentJobs.length}</h3>
            <p>Available Jobs</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <Link to="/student/jobs" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(79,70,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "1.2rem" }}>
            <FaSearch />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--gray-800)" }}>Browse Jobs</p>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>Find and apply to jobs</p>
          </div>
        </Link>
        <Link to="/student/applications" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)", fontSize: "1.2rem" }}>
            <FaFileAlt />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--gray-800)" }}>My Applications</p>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>Track your applications</p>
          </div>
        </Link>
        <Link to="/student/profile" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", fontSize: "1.2rem" }}>
            <FaCloudUploadAlt />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--gray-800)" }}>Profile & Resume</p>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>Update your details</p>
          </div>
        </Link>
      </div>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/student/applications" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.job?.title || "Job Removed"}</td>
                    <td>{app.job?.company || "-"}</td>
                    <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                    <td style={{ fontSize: "0.85rem" }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;