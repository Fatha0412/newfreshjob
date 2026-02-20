const multer = require("multer");
const path = require("path");

// Resume upload configuration
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Profile image upload configuration
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `profile_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const resumeFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed for resumes"), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

module.exports = { uploadResume, uploadProfileImage };
