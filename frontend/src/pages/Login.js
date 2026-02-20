import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaBriefcase, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/shared.css";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Use the login function from AuthContext
      // It will handle the fetch, the localStorage, and the state for you
      await login(email, password); 
      
      alert("Login Success!");
      navigate("/"); // Now the bouncer will recognize you!
      
    } catch (error) {
      console.error("Login error:", error);
      // Check if it's a network error or wrong credentials
      const message = error.response?.data?.message || "Invalid email or password";
      alert("Login Failed: " + message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FaBriefcase className="auth-logo" />
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <FaLock className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <div className="demo-grid">
              <div className="demo-item" onClick={() => { setEmail("admin@JOBS@RSR.com"); setPassword("admin123"); }}>
                <span className="demo-role admin">Admin</span>
                <small>admin@JOBS@RSR.com</small>
              </div>
              <div className="demo-item" onClick={() => { setEmail("hr@techcorp.com"); setPassword("hr1234"); }}>
                <span className="demo-role hr">HR</span>
                <small>hr@techcorp.com</small>
              </div>
              <div className="demo-item" onClick={() => { setEmail("amit@student.com"); setPassword("student123"); }}>
                <span className="demo-role student">Student</span>
                <small>amit@student.com</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;