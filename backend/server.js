const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');

dotenv.config();

const app = express();

// 🚀 AUTO-BUILDER: Create BOTH upload folders if they don't exist!
const resumeDir = path.join(__dirname, 'uploads', 'resumes');
const profileDir = path.join(__dirname, 'uploads', 'profiles');

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
  console.log('✅ Created uploads/resumes directory automatically');
}

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
  console.log('✅ Created uploads/profiles directory automatically');
}

// --- MIDDLEWARE ---

// 1. Static Folder (Serves your Resumes and Profile Images)
// This makes https://freshjob-wb5m.onrender.com/uploads/... accessible to the frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. CORS (Allows your React app at port 3000 to send requests here)
app.use(cors());

// 3. Manual Headers (Fixes potential browser blocking issues)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 4. Body Parser
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- API ROUTES ---

// Auth & Users
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Admin (Handles fetching all users and admin dashboard stats)
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Jobs (Handles posting and browsing)
app.use('/api/jobs', require('./routes/jobRoutes'));

// Jobs Alias (Handles the Admin page request)
app.use('/api/v1/jobs', require('./routes/jobRoutes'));

// Uploads (Handles file processing logic)
app.use('/api/upload', require('./routes/uploadRoutes'));

// Applications (Handles the student applying to jobs)
// ✅ This connects your applicationRoutes.js logic to the /api/applications URL
app.use('/api/applications', require('./routes/applicationRoutes')); 

// Root Health Check
app.get('/', (req, res) => res.send('API is Running Successfully'));

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --- DEBUG TOOL ---
// Check if your resume folder is working: https://freshjob-wb5m.onrender.com/debug/list-resumes
app.get('/debug/list-resumes', (req, res) => {
  const checkResumePath = path.join(__dirname, 'uploads/resumes');
  if (!fs.existsSync(checkResumePath)) {
    return res.status(404).json({ error: "Uploads/resumes folder does not exist!" });
  }
  fs.readdir(checkResumePath, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ files });
  });
});