const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String, // resume file path at the time of application
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interviewed", "selected", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
