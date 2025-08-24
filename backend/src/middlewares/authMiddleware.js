// backend/src/middleware/authMiddleware.js
const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    console.log("✅ Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;