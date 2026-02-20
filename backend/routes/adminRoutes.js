const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/dashboard - Dashboard stats
router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalHRs = await User.countDocuments({ role: "hr" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const totalApplications = await Application.countDocuments();

    const recentJobs = await Job.find()
      .populate("postedBy", "name company")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ appliedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalHRs,
        totalJobs,
        activeJobs,
        totalApplications,
      },
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users - Get all users
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/users/:id/toggle-active - Activate/Deactivate user
router.put("/users/:id/toggle-active", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
