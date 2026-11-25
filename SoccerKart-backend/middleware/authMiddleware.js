
const JWT = require("jsonwebtoken");
const User1 = require("../models/users");

// Verify user token
const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User1.findById(req.user.userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    next();

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { requireSignIn, isAdmin };
