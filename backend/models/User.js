const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "hr", "student"],
      default: "student",
    },
    phone: {
      type: String,
      default: "",
    },
    // Student-specific fields
    resume: {
      type: String, // file path to uploaded resume
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    // HR-specific fields
    company: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
