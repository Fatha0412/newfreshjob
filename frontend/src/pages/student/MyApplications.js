import React, { useState, useEffect } from "react";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../utils/api";
import "../../styles/shared.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // ✅ Fixed: Using absolute URL to bypass the /v1/ ghost
      const res = await api.get("https://freshjob-wb5m.onrender.com/api/applications/my-applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = filter
    ? applications.filter((a) => a.status === filter)
    : applications;

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied": return "📨";
      case "shortlisted": return "⭐";
      case "interviewed": return "🎤";
      case "selected": return "🎉";
      case "rejected": return "❌";
      default: return "📋";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of all your job applications</p>
      </div>

      <div className="search-bar">
        <select className="form-control" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
        <span style={{ color: "var(--gray-500)", fontSize: "0.9rem", alignSelf: "center" }}>
          {filteredApps.length} application(s)
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="empty-state card">
          <FaBriefcase style={{ fontSize: "3rem", color: "var(--gray-300)" }} />
          <h3>No applications {filter ? `with status "${filter}"` : "yet"}</h3>
          <p>{!filter && "Start browsing jobs and apply with one click!"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredApps.map((app) => (
            <div key={app._id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                <span style={{ fontSize: "1.5rem" }}>{getStatusIcon(app.status)}</span>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "4px" }}>
                    {app.job?.title || "Job Removed"}
                  </h3>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                      {app.job?.company || "-"}
                    </span>
                    {app.job?.location && (
                      <span style={{ fontSize: "0.85rem", color: "var(--gray-500)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaMapMarkerAlt /> {app.job.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span className={`status-badge status-${app.status}`} style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>
                  {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;