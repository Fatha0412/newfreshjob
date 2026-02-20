import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/shared.css";

const ManageAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/all");
      setJobs(res.data);
    } catch (error) {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId, title) => {
    if (!window.confirm(`Delete job: ${title}?`)) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch (error) {
      toast.error("Error deleting job");
    }
  };

  const updateStatus = async (jobId, status) => {
    try {
      await api.put(`/jobs/${jobId}`, { status });
      toast.success(`Job ${status}`);
      fetchJobs();
    } catch (error) {
      toast.error("Error updating job");
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Jobs</h1>
        <p>Manage all job listings on the platform</p>
      </div>

      <div className="search-bar">
        <div style={{ position: "relative", flex: 1 }}>
          <FaSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>No jobs found</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className={`job-type-badge ${job.type.toLowerCase().replace(" ", "-")}`}>
                        {job.type}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>{job.applicationsCount}</td>
                    <td>
                      <select
                        value={job.status}
                        onChange={(e) => updateStatus(job._id, e.target.value)}
                        style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--gray-300)", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job._id, job.title)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAllJobs;
