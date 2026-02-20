import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBriefcase, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return (
          <>
            <Link to="/admin/dashboard" className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin/users" className={`nav-link ${isActive("/admin/users") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Users</Link>
            <Link to="/admin/jobs" className={`nav-link ${isActive("/admin/jobs") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>All Jobs</Link>
          </>
        );
      case "hr":
        return (
          <>
            <Link to="/hr/dashboard" className={`nav-link ${isActive("/hr/dashboard") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/hr/post-job" className={`nav-link ${isActive("/hr/post-job") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Post Job</Link>
            <Link to="/hr/my-jobs" className={`nav-link ${isActive("/hr/my-jobs") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>My Jobs</Link>
          </>
        );
      case "student":
        return (
          <>
            <Link to="/student/dashboard" className={`nav-link ${isActive("/student/dashboard") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/student/jobs" className={`nav-link ${isActive("/student/jobs") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            <Link to="/student/applications" className={`nav-link ${isActive("/student/applications") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>My Applications</Link>
            <Link to="/student/profile" className={`nav-link ${isActive("/student/profile") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Profile</Link>
          </>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const colors = { admin: "#ef4444", hr: "#0ea5e9", student: "#10b981" };
    return (
      <span className="role-badge" style={{ background: colors[user.role] }}>
        {user.role.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBriefcase className="brand-icon" />
          <span>JOBS@RSR</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <div className="nav-links">
            {getNavLinks()}
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <FaUser className="user-icon" />
                  <span className="user-name">{user.name}</span>
                  {getRoleBadge()}
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
