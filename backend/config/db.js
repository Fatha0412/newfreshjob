const mongoose = require("mongoose");

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = "mongodb+srv://fatha_rsr:fatha0412@cluster0.ai3sdjl.mongodb.net/";

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // If connection fails, error will be caught below and process will exit
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    const bcrypt = require("bcryptjs");
    const User = require("../models/User");
    const Job = require("../models/Job");

    const salt = await bcrypt.genSalt(10);

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@JOBSRSR.com",
      password: await bcrypt.hash("admin123", salt),
      role: "admin",
      phone: "9999999999",
    });

    // Create HR Users
    const hr1 = await User.create({
      name: "Priya Sharma",
      email: "hr@techcorp.com",
      password: await bcrypt.hash("hr1234", salt),
      role: "hr",
      phone: "9876543210",
      company: "TechCorp Solutions",
      designation: "HR Manager",
    });

    const hr2 = await User.create({
      name: "Rahul Verma",
      email: "hr@innovate.com",
      password: await bcrypt.hash("hr1234", salt),
      role: "hr",
      phone: "9876543211",
      company: "Innovate Labs",
      designation: "Talent Acquisition Lead",
    });

    // Create Student Users
    await User.create({
      name: "Amit Kumar",
      email: "amit@student.com",
      password: await bcrypt.hash("student123", salt),
      role: "student",
      phone: "9123456780",
      skills: ["JavaScript", "React", "Node.js"],
      education: "B.Tech Computer Science - 2025",
      experience: "Fresher",
      bio: "Passionate full-stack developer looking for exciting opportunities.",
    });

    await User.create({
      name: "Sneha Patel",
      email: "sneha@student.com",
      password: await bcrypt.hash("student123", salt),
      role: "student",
      phone: "9123456781",
      skills: ["Python", "Machine Learning", "Data Science"],
      education: "M.Tech AI - 2025",
      experience: "1 year internship",
      bio: "Data science enthusiast with a passion for AI and ML.",
    });

    // Create Jobs
    const jobs = [
      {
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        location: "Bangalore",
        type: "Full-time",
        salary: "₹8,00,000 - ₹12,00,000",
        description: "We are looking for a skilled Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.",
        requirements: ["B.Tech/B.E in CS or related field", "Strong problem-solving skills", "Good communication"],
        skillsRequired: ["JavaScript", "React", "Node.js", "MongoDB"],
        experience: "Fresher",
        openings: 5,
        deadline: new Date("2026-04-30"),
        postedBy: hr1._id,
      },
      {
        title: "Data Scientist",
        company: "Innovate Labs",
        location: "Hyderabad",
        type: "Full-time",
        salary: "₹10,00,000 - ₹15,00,000",
        description: "Join our data science team to build ML models and drive data-driven decision making across the organization.",
        requirements: ["M.Tech/MS in Data Science or related", "Experience with ML frameworks", "Strong analytical skills"],
        skillsRequired: ["Python", "TensorFlow", "SQL", "Statistics"],
        experience: "0-2 years",
        openings: 3,
        deadline: new Date("2026-05-15"),
        postedBy: hr2._id,
      },
      {
        title: "Frontend Developer Intern",
        company: "TechCorp Solutions",
        location: "Remote",
        type: "Internship",
        salary: "₹15,000/month",
        description: "6-month internship opportunity for passionate frontend developers. Learn and grow with our experienced team.",
        requirements: ["Currently pursuing B.Tech/BCA", "Basic knowledge of web development"],
        skillsRequired: ["HTML", "CSS", "JavaScript", "React"],
        experience: "Fresher",
        openings: 10,
        deadline: new Date("2026-03-31"),
        postedBy: hr1._id,
      },
      {
        title: "Backend Engineer",
        company: "Innovate Labs",
        location: "Pune",
        type: "Full-time",
        salary: "₹9,00,000 - ₹14,00,000",
        description: "Build scalable microservices and APIs for our cloud-native platform. Work with cutting-edge technologies.",
        requirements: ["B.Tech in CS or equivalent", "Understanding of system design", "Database knowledge"],
        skillsRequired: ["Node.js", "Python", "Docker", "AWS"],
        experience: "1-3 years",
        openings: 4,
        deadline: new Date("2026-04-15"),
        postedBy: hr2._id,
      },
      {
        title: "UI/UX Designer",
        company: "TechCorp Solutions",
        location: "Bangalore",
        type: "Full-time",
        salary: "₹6,00,000 - ₹10,00,000",
        description: "Design beautiful and intuitive user interfaces. Work closely with developers to bring designs to life.",
        requirements: ["Degree in Design or related field", "Portfolio required"],
        skillsRequired: ["Figma", "Adobe XD", "CSS", "User Research"],
        experience: "Fresher",
        openings: 2,
        deadline: new Date("2026-05-01"),
        postedBy: hr1._id,
      },
      {
        title: "DevOps Engineer",
        company: "Innovate Labs",
        location: "Bangalore",
        type: "Full-time",
        salary: "₹12,00,000 - ₹18,00,000",
        description: "Manage CI/CD pipelines, containerization, and cloud infrastructure. Ensure high availability and scalability of our services.",
        requirements: ["B.Tech in CS or equivalent", "Experience with cloud platforms", "Knowledge of containerization"],
        skillsRequired: ["AWS", "Docker", "Kubernetes", "Jenkins", "Linux"],
        experience: "1-3 years",
        openings: 2,
        deadline: new Date("2026-04-20"),
        postedBy: hr2._id,
      },
    ];

    await Job.insertMany(jobs);

    console.log("Database seeded with sample data!");
    console.log("  Admin:   admin@JOBSRSR.com / admin123");
    console.log("  HR:      hr@techcorp.com / hr1234");
    console.log("  HR:      hr@innovate.com / hr1234");
    console.log("  Student: amit@student.com / student123");
    console.log("  Student: sneha@student.com / student123");
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

module.exports = connectDB;
