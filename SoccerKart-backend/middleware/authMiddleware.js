const JWT = require("jsonwebtoken");
const User1 = require("../models/users");

//Protected Route Token Based
const requireSignIn = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: "Access Denied: No token provided" });
    }

    let decoded;
    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // Previously this only logged, so an expired/invalid token left the request hanging forever.
        console.log(error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await User1.findById(req.user.userID)
        if (!user || user.role !== 1) {
            return res.status(403).json({ error: "Access denied, admin only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {requireSignIn, isAdmin};
