// backend/src/middleware/authMiddleware.js
const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  try {
    // Try cookie first, then Authorization header as backup
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    console.log("✅ Token verified, user:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;