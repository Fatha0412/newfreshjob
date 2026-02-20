import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBriefcase, FaFileAlt, FaUserTie, FaUserGraduate, FaCheckCircle } from "react-icons/fa";
import api from "../../utils/api";
import "../../styles/shared.css";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <div className="spinner" style={{ margin: "0 auto" }}></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of the job portal platform</p>
      </div>

      {data && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--primary)" }}>
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>{data.stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--success)" }}>
                <FaUserGraduate />
              </div>
              <div className="stat-info">
                <h3>{data.stats.totalStudents}</h3>
                <p>Students</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--secondary)" }}>
                <FaUserTie />
              </div>
              <div className="stat-info">
                <h3>{data.stats.totalHRs}</h3>
                <p>HR / Recruiters</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--warning)" }}>
                <FaBriefcase />
              </div>
              <div className="stat-info">
                <h3>{data.stats.totalJobs}</h3>
                <p>Total Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#10b981" }}>
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <h3>{data.stats.activeJobs}</h3>
                <p>Active Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#8b5cf6" }}>
                <FaFileAlt />
              </div>
              <div className="stat-info">
                <h3>{data.stats.totalApplications}</h3>
                <p>Applications</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="card">
              <div className="section-header">
                <h2>Recent Jobs</h2>
                <Link to="/admin/jobs" className="btn btn-sm btn-outline">View All</Link>
              </div>
              {data.recentJobs.length === 0 ? (
                <p style={{ color: "var(--gray-400)", textAlign: "center", padding: "20px" }}>No jobs yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {data.recentJobs.map((job) => (
                    <div key={job._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--gray-50)", borderRadius: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{job.title}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{job.company}</p>
                      </div>
                      <span className={`status-badge status-${job.status}`}>{job.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="section-header">
                <h2>Recent Applications</h2>
              </div>
              {data.recentApplications.length === 0 ? (
                <p style={{ color: "var(--gray-400)", textAlign: "center", padding: "20px" }}>No applications yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {data.recentApplications.map((app) => (
                    <div key={app._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--gray-50)", borderRadius: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{app.applicant?.name}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>Applied for {app.job?.title}</p>
                      </div>
                      <span className={`status-badge status-${app.status}`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
