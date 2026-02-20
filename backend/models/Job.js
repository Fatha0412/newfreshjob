const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
      default: "Full-time",
    },
    salary: {
      type: String,
      default: "Not Disclosed",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "Fresher",
    },
    openings: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: Date,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
