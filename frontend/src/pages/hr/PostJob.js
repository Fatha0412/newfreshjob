import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/shared.css";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    skillsRequired: "",
    experience: "Fresher",
    openings: 1,
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        status: "active", // Ensure status is always active
        skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : [],
        requirements: formData.requirements ? formData.requirements.split(',').map(s => s.trim()) : [],
      };

      // ✅ THE FINAL FIX: Using the absolute URL to bypass the 'v1' mismatch
      await api.post("https://freshjob-wb5m.onrender.com/api/jobs", formattedData);
      
      toast.success("Job posted successfully!");
      navigate("/hr/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error posting job");
      console.error("Post Job Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Fill in the details to create a new job listing</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" className="form-control" name="title" placeholder="e.g. Full Stack Developer" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" className="form-control" name="company" placeholder="Company name" value={formData.company} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" className="form-control" name="location" placeholder="e.g. Bangalore, Remote" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary</label>
              <input type="text" className="form-control" name="salary" placeholder="e.g. ₹8,00,000 - ₹12,00,000" value={formData.salary} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <select className="form-control" name="experience" value={formData.experience} onChange={handleChange}>
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Number of Openings</label>
              <input type="number" className="form-control" name="openings" min="1" value={formData.openings} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea className="form-control" name="description" rows="5" placeholder="Describe the role, responsibilities, and what you're looking for..." value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="form-group">
            <label>Requirements (comma-separated)</label>
            <textarea className="form-control" name="requirements" rows="3" placeholder="e.g. B.Tech in CS, Good communication skills, Problem-solving ability" value={formData.requirements} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Skills Required (comma-separated)</label>
            <input type="text" className="form-control" name="skillsRequired" placeholder="e.g. JavaScript, React, Node.js, MongoDB" value={formData.skillsRequired} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;