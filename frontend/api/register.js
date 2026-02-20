import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role, phone, company, designation } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      phone: phone || "",
    };

    if (role === "hr") {
      userData.company = company || "";
      userData.designation = designation || "";
    }

    // 4. Create the user in the database
    const user = await User.create(userData);

    // 5. Generate JWT Token immediately
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1d" }
    );

    // 6. Send Success Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};
