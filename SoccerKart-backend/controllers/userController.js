const User1 = require("../models/users");

// GET ALL USERS
const getAllUsersController = async (req, res) => {
  try {
    const users = await User1.find({})
      .select("-password -answer")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      total: users.length,
      message: "All Users Fetched Successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting users",
      error: error.message,
    });
  }
};

// GET SINGLE USER
const getSingleUserController = async (req, res) => {
  try {
    const user = await User1.findById(req.params.uid)
      .select("-password -answer");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user",
      error: error.message,
    });
  }
};

// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Validation
    if (!name || !email || role === undefined) {
      return res.status(400).send({
        success: false,
        message: "Name, email and role are required",
      });
    }

    if (![0, 1].includes(Number(role))) {
      return res.status(400).send({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await User1.findByIdAndUpdate(
      req.params.uid,
      {
        name,
        email,
        role: Number(role),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -answer");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(error.code === 11000 ? 409 : 500).send({
      success: false,
      message:
        error.code === 11000
          ? "Email already exists"
          : "Error in updating user",
      error: error.message,
    });
  }
};

// DELETE USER
const deleteUserController = async (req, res) => {
  try {
    const user = await User1.findByIdAndDelete(req.params.uid);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting user",
      error: error.message,
    });
  }
};

// SEARCH USERS
const searchUserController = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || !keyword.trim()) {
      return res.status(400).send({
        success: false,
        message: "Search keyword is required",
      });
    }

    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User1.find({
      $or: [
        { name: { $regex: safeKeyword, $options: "i" } },
        { email: { $regex: safeKeyword, $options: "i" } },
      ],
    }).select("-password -answer");

    res.status(200).send({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searching users",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
  searchUserController,
};