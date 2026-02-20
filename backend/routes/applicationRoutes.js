const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// POST /api/applications/:jobId - Easy Apply to a job (student only)
router.post("/:jobId", protect, authorize("student"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.status !== "active") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Check if student has a resume
    const student = await User.findById(req.user._id);
    if (!student.resume) {
      return res.status(400).json({ message: "Please upload your resume before applying" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: student.resume,
    });

    // Increment application count
    await Job.findByIdAndUpdate(req.params.jobId, {
      $inc: { applicationsCount: 1 },
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications/my-applications - Student's applications
router.get("/my-applications", protect, authorize("student"), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title company location type salary status",
      })
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications/job/:jobId - Get all applications for a job (HR who posted)
router.get("/job/:jobId", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // HR can only see applications for their own jobs
    if (
      req.user.role === "hr" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email phone skills education experience resume profileImage")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/applications/:id/status - Update application status (HR or Admin)
router.put("/:id/status", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // HR can only update their own job applications
    if (
      req.user.role === "hr" &&
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    if (req.body.notes) application.notes = req.body.notes;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications/all - All applications (Admin only)
router.get("/all", protect, authorize("admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email phone")
      .populate("job", "title company location")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
