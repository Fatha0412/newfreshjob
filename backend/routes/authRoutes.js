const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "JOBS@RSR_secret_key_2026_super_secure",
    { expiresIn: "30d" }
  );
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  console.log('Request received at:', new Date().toISOString());
  try {
    const { name, email, password, role, phone, company, designation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      phone: phone || "",
    };

    // HR-specific fields
    if (role === "hr") {
      userData.company = company || "";
      userData.designation = designation || "";
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  console.log('Request received at:', new Date().toISOString());
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      resume: user.resume,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      bio: user.bio,
      profileImage: user.profileImage,
      company: user.company,
      designation: user.designation,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me - Get current user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/profile - Update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, phone, skills, education, experience, bio, company, designation } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (skills !== undefined) user.skills = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills;
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (bio !== undefined) user.bio = bio;
    if (company !== undefined) user.company = company;
    if (designation !== undefined) user.designation = designation;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      resume: updatedUser.resume,
      skills: updatedUser.skills,
      education: updatedUser.education,
      experience: updatedUser.experience,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
      company: updatedUser.company,
      designation: updatedUser.designation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
