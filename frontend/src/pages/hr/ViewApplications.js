import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaEnvelope, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/shared.css";

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      // ✅ Fixed: Using absolute URLs to bypass the /v1/ ghost for both requests
      const [appsRes, jobRes] = await Promise.all([
        api.get(`https://freshjob-wb5m.onrender.com/api/applications/job/${jobId}`),
        api.get(`https://freshjob-wb5m.onrender.com/api/jobs/${jobId}`),
      ]);
      setApplications(appsRes.data);
      setJob(jobRes.data);
    } catch (error) {
      console.error("Error Fetching Applicants:", error);
      toast.error("Error fetching applicants data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      // ✅ Fixed: Using absolute URL for status updates
      await api.put(`https://freshjob-wb5m.onrender.com/api/applications/${appId}/status`, { status });
      toast.success(`Application updated to ${status}`);
      fetchData(); // Refresh the list to show the new status
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Error updating status");
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
      <Link to="/hr/my-jobs" className="btn btn-sm btn-secondary" style={{ marginBottom: 20 }}>
        <FaArrowLeft /> Back to My Jobs
      </Link>

      {job && (
        <div className="page-header">
          <h1>Applications for "{job.title}"</h1>
          <p>{job.company} · {job.location} · {applications.length} applicant(s)</p>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state card">
          <h3>No applications yet</h3>
          <p>Applications will appear here when students apply</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Contact</th>
                <th>Skills</th>
                <th>Education</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.applicant?.name || "Unknown Applicant"}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem" }}>
                      {app.applicant?.email && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <FaEnvelope style={{ color: "var(--gray-400)" }} /> {app.applicant.email}
                        </span>
                      )}
                      {app.applicant?.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <FaPhone style={{ color: "var(--gray-400)" }} /> {app.applicant.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {app.applicant?.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag" style={{ fontSize: "0.7rem" }}>{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: "0.85rem" }}>{app.applicant?.education || "-"}</td>
                  <td style={{ fontSize: "0.85rem" }}>{app.applicant?.experience || "-"}</td>
                  <td>
                    {app.resume ? (
                      <a
                        href={`https://freshjob-wb5m.onrender.com/${app.resume.replace(/^\\|^\//, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-secondary"
                      >
                        <FaDownload /> Resume
                      </a>
                    ) : (
                      <span style={{ color: "var(--gray-400)" }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${app.status}`}>{app.status}</span>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--gray-300)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {/* Using the exact enum values from your Application Model */}
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;