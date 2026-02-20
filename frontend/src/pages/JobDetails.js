import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaBuilding, FaCalendar, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "../styles/shared.css";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);

      if (user && user.role === "student") {
        try {
          const appsRes = await api.get("/applications/my-applications");
          setApplied(appsRes.data.some((a) => a.job?._id === id));
        } catch {}
      }
    } catch (error) {
      toast.error("Job not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.resume) {
      toast.warning("Please upload your resume first");
      navigate("/student/profile");
      return;
    }
    setApplying(true);
    try {
      await api.post(`/applications/${id}`);
      toast.success("Applied successfully!");
      setApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <div className="spinner" style={{ margin: "0 auto" }}></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="page-container" style={{ maxWidth: "900px" }}>
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-secondary" style={{ marginBottom: "20px" }}>
        <FaArrowLeft /> Back
      </button>

      <div className="card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "4px" }}>{job.title}</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: 600 }}>
              <FaBuilding style={{ marginRight: "8px" }} />{job.company}
            </p>
          </div>
          <span className={`job-type-badge ${job.type.toLowerCase().replace(" ", "-")}`} style={{ fontSize: "0.85rem", padding: "6px 16px" }}>
            {job.type}
          </span>
        </div>

        <div className="job-meta" style={{ marginBottom: "32px" }}>
          <span><FaMapMarkerAlt /> {job.location}</span>
          <span><FaMoneyBillWave /> {job.salary}</span>
          <span><FaClock /> {job.experience}</span>
          <span><FaBriefcase /> {job.openings} opening(s)</span>
          {job.deadline && (
            <span><FaCalendar /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          )}
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Job Description</h3>
          <p style={{ color: "var(--gray-600)", whiteSpace: "pre-line", lineHeight: 1.8 }}>{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Requirements</h3>
            <ul style={{ paddingLeft: "24px" }}>
              {job.requirements.map((req, idx) => (
                <li key={idx} style={{ color: "var(--gray-600)", marginBottom: "8px", listStyle: "disc" }}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.skillsRequired?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Skills Required</h3>
            <div className="job-skills">
              {job.skillsRequired.map((skill, idx) => (
                <span key={idx} className="skill-tag" style={{ fontSize: "0.85rem", padding: "5px 14px" }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {user?.role === "student" && (
          <div style={{ paddingTop: "24px", borderTop: "1px solid var(--gray-200)" }}>
            {applied ? (
              <button className="btn btn-success btn-lg" disabled style={{ width: "100%" }}>
                <FaCheckCircle /> Already Applied
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
                onClick={handleApply}
                disabled={applying}
              >
                <FaPaperPlane /> {applying ? "Applying..." : "Easy Apply Now"}
              </button>
            )}
          </div>
        )}

        {!user && (
          <div style={{ paddingTop: "24px", borderTop: "1px solid var(--gray-200)", textAlign: "center" }}>
            <p style={{ color: "var(--gray-500)", marginBottom: "12px" }}>Login to apply for this job</p>
            <Link to="/login" className="btn btn-primary btn-lg">Sign In to Apply</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
