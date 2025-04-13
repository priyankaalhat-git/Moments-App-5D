const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, mobile, country } = req.body;

    // Validate input
    if (!fullName || !email || !password || !mobile || !country) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Email already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      country,
    });
    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ status: true, message: "Login successful", token });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
  }
});

module.exports = router;
