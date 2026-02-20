const express = require("express");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/jobs - Get all active jobs (public)
router.get("/", async (req, res) => {
  try {
    const { search, type, location, experience } = req.query;
    let query = { status: "active" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
    if (experience) query.experience = experience;

    const jobs = await Job.find(query)
      .populate("postedBy", "name email company")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/all - Get all jobs including inactive (admin only)
router.get("/all", protect, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email company")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/my-jobs - Get jobs posted by current HR
router.get("/my-jobs", protect, authorize("hr"), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id - Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email company"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs - Create a new job (HR only)
router.post("/", protect, authorize("hr"), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      skillsRequired,
      experience,
      openings,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      company: company || req.user.company,
      location,
      type,
      salary,
      description,
      requirements: typeof requirements === "string" ? requirements.split(",").map((r) => r.trim()) : requirements || [],
      skillsRequired: typeof skillsRequired === "string" ? skillsRequired.split(",").map((s) => s.trim()) : skillsRequired || [],
      experience,
      openings,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/jobs/:id - Update a job (HR who posted or Admin)
router.put("/:id", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // HR can only update their own jobs
    if (
      req.user.role === "hr" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updates = req.body;
    if (updates.requirements && typeof updates.requirements === "string") {
      updates.requirements = updates.requirements.split(",").map((r) => r.trim());
    }
    if (updates.skillsRequired && typeof updates.skillsRequired === "string") {
      updates.skillsRequired = updates.skillsRequired.split(",").map((s) => s.trim());
    }

    job = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/jobs/:id - Delete a job (HR who posted or Admin)
router.delete("/:id", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role === "hr" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
