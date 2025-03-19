const express = require("express");
const registerController = require('../controllers/authController.js');
// const isAdmin = require('../middleware/authMiddleware.js/');
const {requireSignIn} = require('../middleware/authMiddleware.js')

//router object
const router = express.Router();


router.post('/register', registerController);

// protectedroute auth
router.get("/userauth", requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
    console.log(ok);
});

module.exports = router;