const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  try {
    //debug
    console.log("🍪 All cookies:", req.cookies);
    
    let token = req.cookies.token;
    let tokenSource = "cookie";
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
      tokenSource = "header";
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      console.log("Request from:", req.get('origin'));
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    console.log(`✅ Token verified from ${tokenSource}, user:`, decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;