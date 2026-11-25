const User1 = require("../models/users.js")
const { hashPassword, comparePassword } = require("../helpers/authHelper.js")

const PHONE = /^\+?[0-9][0-9\s-]{6,18}$/;
const clean = (v) => (typeof v === "string" ? v.trim() : "");

// same shape as the /login response, so the frontend can merge it into its saved session
const publicUser = (u) => ({
    id: u._id, name: u.name, email: u.email, role: u.role,
    phone: u.phone || "", address: u.address || "",
});

const registerController = async(req, res) => {
    try {
        // stub kept as-is; the live register route is POST /register in index.js
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Error', error })
    }
}

const getAllUsersController = async (req, res) => {
    try {
        const users = await User1.find({}).select("-password -answer").sort({ createdAt: -1 });
        res.status(200).send({ success: true, countTotal: users.length, message: "All users", users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting users", error: error.message });
    }
}

const getProfileController = async (req, res) => {
    try {
        const user = await User1.findById(req.user.userID);
        if (!user) return res.status(404).send({ success: false, message: "User not found" });
        res.status(200).send({ success: true, user: publicUser(user) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting profile", error: error.message });
    }
}

const updateProfileController = async (req, res) => {
    try {
        const { name, phone, address, currentPassword, newPassword } = req.body;
        const user = await User1.findById(req.user.userID);
        if (!user) return res.status(404).send({ success: false, message: "User not found" });

        const update = {};
        if (name !== undefined) {
            const n = clean(name);
            if (!n) return res.status(400).send({ success: false, message: "Name is required" });
            if (n.length > 60) return res.status(400).send({ success: false, message: "Name is too long" });
            update.name = n;
        }
        if (phone !== undefined) {
            const p = clean(phone);
            if (p && !PHONE.test(p)) return res.status(400).send({ success: false, message: "Enter a valid phone number" });
            update.phone = p;
        }
        if (address !== undefined) {
            const a = clean(address);
            if (a.length > 200) return res.status(400).send({ success: false, message: "Address is too long" });
            update.address = a;
        }
        if (newPassword) {
            if (!currentPassword) return res.status(400).send({ success: false, message: "Enter your current password" });
            if (!(await comparePassword(currentPassword, user.password))) {
                return res.status(400).send({ success: false, message: "Current password is incorrect" });
            }
            if (String(newPassword).length < 6) {
                return res.status(400).send({ success: false, message: "New password must be at least 6 characters" });
            }
            const hashed = await hashPassword(newPassword);
            if (!hashed) throw new Error("Could not hash password");
            update.password = hashed;
        }

        const updated = await User1.findByIdAndUpdate(user._id, update, { new: true });
        res.status(200).send({ success: true, message: "Profile updated successfully", user: publicUser(updated) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating profile", error: error.message });
    }
}

module.exports = { registerController, getAllUsersController, getProfileController, updateProfileController };
