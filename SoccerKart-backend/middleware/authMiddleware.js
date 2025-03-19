const JWT = require("jsonwebtoken");
const User1 = require("../models/users");
// const dotenv = require("dotenv");





//Protected Route Token Based
// dotenv.config();

const requireSignIn = (req, res, next) => {    
        try {
            const token = req.headers.authorization;
        
            if (!token) {
              return res.status(403).json({ error: "Access Denied: No token provided" });
            }
        
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();            
    } catch (error) {
        console.log(error.message);        
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const user = await User1.findById(req.user.userID)
        if(user.role !== 1 ){
            return res.status(403).json({ error: "Access denied, admin only" });

        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {requireSignIn, isAdmin};