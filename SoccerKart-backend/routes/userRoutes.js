const express = require("express");
const router = express.Router();

const {
  getAllUsersController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
  searchUserController,
} = require("../controllers/userController");

const {
  requireSignIn,
  isAdmin,
} = require("../middleware/authMiddleware");

// All routes below require admin authentication
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

router.get("/single-user/:uid", requireSignIn, isAdmin, getSingleUserController);

router.put("/update-user/:uid", requireSignIn, isAdmin, updateUserController);

router.delete("/delete-user/:uid", requireSignIn, isAdmin, deleteUserController);

router.get("/search-user", requireSignIn, isAdmin, searchUserController);

module.exports = router;