const express = require("express");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const { uploadResume, uploadProfileImage } = require("../middleware/upload");

const router = express.Router();

// POST /api/upload/resume - Upload resume (student only)
router.post(
  "/resume",
  protect,
  authorize("student"),
  uploadResume.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }

      const user = await User.findById(req.user._id);
      user.resume = req.file.path.replace(/\\/g, "/");
      await user.save();

      res.json({
        message: "Resume uploaded successfully",
        resume: user.resume,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/upload/profile-image - Upload profile image
router.post(
  "/profile-image",
  protect,
  uploadProfileImage.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const user = await User.findById(req.user._id);
      user.profileImage = req.file.path.replace(/\\/g, "/");
      await user.save();

      res.json({
        message: "Profile image uploaded successfully",
        profileImage: user.profileImage,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
