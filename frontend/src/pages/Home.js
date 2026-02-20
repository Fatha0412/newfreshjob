import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaUsers, FaBuilding, FaSearch, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaArrowRight } from "react-icons/fa";
import api from "../utils/api";
import "../styles/shared.css";
import "./Home.css";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your <span className="gradient-text">Dream Job</span> Today</h1>
          <p>Connect with top companies, upload your resume once, and apply to multiple jobs with a single click.</p>
          <div className="hero-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for jobs, companies, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to={`/login`} className="btn btn-primary btn-lg">
              Get Started
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <FaBriefcase />
              <span><strong>500+</strong> Active Jobs</span>
            </div>
            <div className="hero-stat">
              <FaBuilding />
              <span><strong>100+</strong> Companies</span>
            </div>
            <div className="hero-stat">
              <FaUsers />
              <span><strong>10K+</strong> Job Seekers</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle c1"></div>
          <div className="decoration-circle c2"></div>
          <div className="decoration-circle c3"></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="page-container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>
                <FaUsers />
              </div>
              <h3>Register Once</h3>
              <p>Create your profile and upload your resume. Your profile is ready for all future applications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}>
                <FaSearch />
              </div>
              <h3>Browse Jobs</h3>
              <p>Explore hundreds of job listings from top companies. Filter by location, type, and skills.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "rgba(14, 165, 233, 0.1)", color: "var(--secondary)" }}>
                <FaBriefcase />
              </div>
              <h3>Easy Apply</h3>
              <p>Apply to any job with a single click. Your resume is automatically attached to your application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <section className="recent-jobs-section">
          <div className="page-container">
            <div className="section-header">
              <h2 className="section-title">Latest Job Openings</h2>
              <Link to="/login" className="btn btn-outline">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="company">{job.company}</p>
                    </div>
                    <span className={`job-type-badge ${job.type.toLowerCase().replace("-", "-").replace(" ", "-")}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="job-meta">
                    <span><FaMapMarkerAlt /> {job.location}</span>
                    <span><FaMoneyBillWave /> {job.salary}</span>
                    <span><FaClock /> {job.experience}</span>
                  </div>
                  <div className="job-skills">
                    {job.skillsRequired.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="page-container">
          <div className="cta-card">
            <h2>Ready to Start Your Career Journey?</h2>
            <p>Join thousands of students who found their dream job through our portal.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Register as Student</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Register as HR</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-content">
            <div className="footer-brand">
              <FaBriefcase />
              <span>JOBS@RSR</span>
            </div>
            <p>&copy; 2026 JOBS@RSR. Built with MERN Stack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
