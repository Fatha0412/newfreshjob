import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAllJobs from "./pages/admin/ManageAllJobs";
import HRDashboard from "./pages/hr/HRDashboard";
import PostJob from "./pages/hr/PostJob";
import MyJobs from "./pages/hr/MyJobs";
import ViewApplications from "./pages/hr/ViewApplications";
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseJobs from "./pages/student/BrowseJobs";
import MyApplications from "./pages/student/MyApplications";
import Profile from "./pages/student/Profile";
import JobDetails from "./pages/JobDetails";

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Redirect logged-in users to their dashboard
  const getHomeRedirect = () => {
    if (!user) return <Home />;
    switch (user.role) {
      case "admin": return <Navigate to="/admin/dashboard" />;
      case "hr": return <Navigate to="/hr/dashboard" />;
      case "student": return <Navigate to="/student/dashboard" />;
      default: return <Home />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getHomeRedirect()} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute roles={["admin"]}><ManageAllJobs /></ProtectedRoute>} />

      {/* HR Routes */}
      <Route path="/hr/dashboard" element={<ProtectedRoute roles={["hr"]}><HRDashboard /></ProtectedRoute>} />
      <Route path="/hr/post-job" element={<ProtectedRoute roles={["hr"]}><PostJob /></ProtectedRoute>} />
      <Route path="/hr/my-jobs" element={<ProtectedRoute roles={["hr"]}><MyJobs /></ProtectedRoute>} />
      <Route path="/hr/applications/:jobId" element={<ProtectedRoute roles={["hr"]}><ViewApplications /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/jobs" element={<ProtectedRoute roles={["student"]}><BrowseJobs /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute roles={["student"]}><MyApplications /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute roles={["student"]}><Profile /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
