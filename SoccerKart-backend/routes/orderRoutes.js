const express = require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware.js");
const {
  createOrderController, myOrdersController, myOrderController, cancelOrderController,
  allOrdersController, updateStatusController, statsController,
} = require("../controllers/orderController.js");

const router = express.Router();

// customer
router.post("/create", requireSignIn, createOrderController);
router.get("/my-orders", requireSignIn, myOrdersController);
router.get("/my-orders/:id", requireSignIn, myOrderController);
router.put("/cancel/:id", requireSignIn, cancelOrderController);

// admin
router.get("/all-orders", requireSignIn, isAdmin, allOrdersController);
router.put("/status/:id", requireSignIn, isAdmin, updateStatusController);
router.get("/stats", requireSignIn, isAdmin, statsController);

module.exports = router;
