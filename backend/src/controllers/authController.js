// backend/src/controllers/authController.js
const User = require("../models/User");
const { generateToken } = require("../config/jwt");

//register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    // PRODUCTION FIX: Remove domain restrictions
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // SEND TOKEN IN RESPONSE TOO
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // PRODUCTION FIX: Remove domain restrictions
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // SEND TOKEN IN RESPONSE TOO
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
};

//currentuser
const getCurrentUser = async (req, res) => {
  try {
    // Handle different JWT payload structures
    const userId = req.user.userId || req.user._id || req.user;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("getCurrentUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};