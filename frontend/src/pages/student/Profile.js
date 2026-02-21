import React, { useState, useEffect } from "react";
import { FaSave, FaCloudUploadAlt, FaFileAlt, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaCode, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/shared.css";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        skills: user.skills ? user.skills.join(", ") : "",
        education: user.education || "",
        experience: user.experience || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", formData);
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and Word documents are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Use absolute URL to avoid baseURL /v1 prefix
      const res = await api.post("https://freshjob-wb5m.onrender.com/api/upload/resume", formData);
      updateUser({ resume: res.data.resume });
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading resume");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.post("/upload/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ profileImage: res.data.profileImage });
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading image");
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "900px" }}>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your profile and resume for job applications</p>
      </div>

      <div className="profile-layout">
        {/* Left: Profile Card */}
        <div className="profile-sidebar">
          <div className="card profile-card">
            <div className="profile-avatar-wrapper">
              {user.profileImage ? (
                <img
                  src={`https://jobs-rsr.onrender.com/${user.profileImage}`}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <FaUser />
                </div>
              )}
              <label className="avatar-upload-btn">
                <FaCloudUploadAlt />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <h3>{user.name}</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>{user.email}</p>
            <span className="status-badge status-active" style={{ marginTop: "8px" }}>Student</span>

            {/* Resume Section */}
            <div className="resume-section">
              <h4><FaFileAlt /> Resume</h4>
              {user.resume ? (
                <div className="resume-info">
                  <a
                    href={`https://freshjob-wb5m.onrender.com/${user.resume?.replace(/^\\|^\//, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-secondary"
                    style={{ width: "100%" }}
                  >
                    <FaFileAlt /> View Current Resume
                  </a>
                  <label className="btn btn-sm btn-primary" style={{ width: "100%", cursor: "pointer" }}>
                    <FaCloudUploadAlt /> {uploading ? "Uploading..." : "Update Resume"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ display: "none" }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              ) : (
                <div className="resume-upload">
                  <div className="upload-area">
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Upload your resume</p>
                    <small>PDF or Word, max 5MB</small>
                    <label className="btn btn-primary btn-sm" style={{ marginTop: "12px", cursor: "pointer" }}>
                      <FaCloudUploadAlt /> {uploading ? "Uploading..." : "Choose File"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        style={{ display: "none" }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="profile-main">
          <div className="card">
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "24px" }}>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label><FaUser style={{ marginRight: "6px" }} /> Full Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label><FaPhone style={{ marginRight: "6px" }} /> Phone</label>
                  <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                </div>
              </div>

              <div className="form-group">
                <label><FaEnvelope style={{ marginRight: "6px" }} /> Email</label>
                <input type="email" className="form-control" value={user.email} disabled style={{ background: "var(--gray-100)" }} />
                <small style={{ color: "var(--gray-400)" }}>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label><FaCode style={{ marginRight: "6px" }} /> Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node.js, Python"
                />
                {formData.skills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {formData.skills.split(",").map((skill, idx) => (
                      skill.trim() && <span key={idx} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label><FaGraduationCap style={{ marginRight: "6px" }} /> Education</label>
                <input
                  type="text"
                  className="form-control"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science - 2025, ABC University"
                />
              </div>

              <div className="form-group">
                <label><FaBriefcase style={{ marginRight: "6px" }} /> Experience</label>
                <input
                  type="text"
                  className="form-control"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. Fresher, 1 year internship at XYZ"
                />
              </div>

              <div className="form-group">
                <label>About Me / Bio</label>
                <textarea
                  className="form-control"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell employers about yourself, your interests, and career goals..."
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  <FaSave /> {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
