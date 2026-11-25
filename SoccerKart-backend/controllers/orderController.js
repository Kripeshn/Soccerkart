
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const DELIVERY_FEE = 100;

const placeOrderController = async (req, res) => {
  let session;

  try {
    const { items, shippingAddress } = req.body;

    // 1. Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Your cart is empty",
      });
    }

    // 2. Validate shipping address
    const requiredAddressFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "district",
    ];

    for (const field of requiredAddressFields) {
      if (
        typeof shippingAddress?.[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return res.status(400).send({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // 3. Combine duplicate product IDs and validate quantities
    const quantityMap = new Map();

    for (const item of items) {
      const { productId, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({
          success: false,
          message: "Invalid product ID",
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).send({
          success: false,
          message: "Product quantity must be a positive integer",
        });
      }

      const id = productId.toString();

      quantityMap.set(
        id,
        (quantityMap.get(id) || 0) + quantity
      );
    }

    // 4. Start MongoDB transaction
    session = await mongoose.startSession();

    let savedOrder;

    await session.withTransaction(async () => {
      const productIds = [...quantityMap.keys()];

      // Fetch real products from database
      const products = await Product.find({
        _id: { $in: productIds },
      }).session(session);

      if (products.length !== productIds.length) {
        const error = new Error("One or more products no longer exist");
        error.statusCode = 404;
        throw error;
      }

      const productMap = new Map(
        products.map((product) => [
          product._id.toString(),
          product,
        ])
      );

      let subtotal = 0;
      const orderItems = [];

      // 5. Validate shipping, stock and calculate prices
      for (const [productId, quantity] of quantityMap) {
        const product = productMap.get(productId);

        if (product.shipping !== true) {
          const error = new Error(
            `${product.name} is not available for shipping`
          );
          error.statusCode = 400;
          throw error;
        }

        if (product.quantity < quantity) {
          const error = new Error(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}`
          );
          error.statusCode = 409;
          throw error;
        }

        const lineTotal = product.price * quantity;
        subtotal += lineTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          slug: product.slug,
          quantity,
          unitPrice: product.price,
          lineTotal,
        });
      }

      // 6. Decrease stock safely
      for (const [productId, quantity] of quantityMap) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            quantity: { $gte: quantity },
            shipping: true,
          },
          {
            $inc: { quantity: -quantity },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          const error = new Error(
            "Product stock changed during checkout. Please review your cart."
          );
          error.statusCode = 409;
          throw error;
        }
      }

      // 7. Calculate final total on backend
      const total = subtotal + DELIVERY_FEE;

      // 8. Save order
      const orders = await Order.create(
        [
          {
            user: req.user.userID,
            items: orderItems,
            shippingAddress: {
              fullName: shippingAddress.fullName.trim(),
              phone: shippingAddress.phone.trim(),
              address: shippingAddress.address.trim(),
              city: shippingAddress.city.trim(),
              district: shippingAddress.district.trim(),
              notes: shippingAddress.notes?.trim() || "",
            },
            paymentMethod: "cod",
            paymentStatus: "pending",
            orderStatus: "pending",
            subtotal,
            deliveryFee: DELIVERY_FEE,
            total,
          },
        ],
        { session }
      );

      savedOrder = orders[0];
    });

    return res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    // MongoDB standalone servers do not support transactions
    if (
      error.code === 20 ||
      error.codeName === "IllegalOperation" ||
      error.message?.includes("Transaction numbers are only allowed")
    ) {
      return res.status(500).send({
        success: false,
        message:
          "Checkout requires MongoDB transaction support. Use MongoDB Atlas or configure your local MongoDB as a replica set.",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong while placing your order",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

module.exports = { placeOrderController };
