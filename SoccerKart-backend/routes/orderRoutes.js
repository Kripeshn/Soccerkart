
const express = require("express");
const { requireSignIn } = require("../middleware/authMiddleware");
const { placeOrderController } = require("../controllers/orderController");

const router = express.Router();

router.post("/place-order", requireSignIn, placeOrderController);

module.exports = router;
