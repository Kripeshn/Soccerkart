const express = require("express");
const {
    registerController,
    getAllUsersController,
    getProfileController,
    updateProfileController,
} = require('../controllers/authController.js');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware.js')

const router = express.Router();

router.post('/register', registerController);

router.get("/userauth", requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
});

// admin: all users  ->  GET /api/v1/auth/users
router.get("/users", requireSignIn, isAdmin, getAllUsersController);

// signed-in user: own profile  ->  GET / PUT /api/v1/auth/profile
router.get("/profile", requireSignIn, getProfileController);
router.put("/profile", requireSignIn, updateProfileController);

module.exports = router;
