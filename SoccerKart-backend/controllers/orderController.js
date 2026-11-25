const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const User = require("../models/users.js");

const DELIVERY_FEE = Number(process.env.DELIVERY_FEE ?? 100);
const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const FINAL = ["Delivered", "Cancelled"];
const PHONE = /^\+?[0-9][0-9\s-]{6,18}$/;
const str = (v) => (typeof v === "string" ? v.trim() : "");

// error carrying an HTTP status, caught by each handler
const fail = (status, message) => Object.assign(new Error(message), { status });
const send = (res, error, fallback) => {
  if (error.status) return res.status(error.status).send({ success: false, message: error.message });
  console.log(error);
  res.status(500).send({ success: false, message: fallback, error: error.message });
};

const restock = (items) =>
  Promise.all(items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { quantity: i.quantity } })));

// ---------- customer ----------
const createOrderController = async (req, res) => {
  const reserved = [];
  try {
    const { items, shippingAddress = {}, paymentMethod = "cod" } = req.body;

    if (!Array.isArray(items) || items.length === 0) throw fail(400, "Your cart is empty");
    if (paymentMethod !== "cod") throw fail(400, "Unsupported payment method");

    const ship = {
      fullName: str(shippingAddress.fullName),
      phone: str(shippingAddress.phone),
      address: str(shippingAddress.address),
      note: str(shippingAddress.note).slice(0, 300),
    };
    if (!ship.fullName) throw fail(400, "Full name is required");
    if (!PHONE.test(ship.phone)) throw fail(400, "Enter a valid phone number");
    if (!ship.address) throw fail(400, "Delivery address is required");
    if (ship.address.length > 200) throw fail(400, "Address is too long");

    // merge duplicates and validate quantities
    const wanted = new Map();
    for (const it of items) {
      const qty = Number(it?.quantity);
      if (!it?.productId || !Number.isInteger(qty) || qty < 1 || qty > 100) throw fail(400, "Invalid item in cart");
      wanted.set(String(it.productId), (wanted.get(String(it.productId)) || 0) + qty);
    }

    // price comes from the database, never from the client
    const lines = [];
    for (const [productId, quantity] of wanted) {
      let p;
      try { p = await Product.findById(productId).select("-photo"); } catch (e) { throw fail(400, "Invalid item in cart"); }
      if (!p) throw fail(404, "A product in your cart no longer exists");
      lines.push({ product: p._id, name: p.name, slug: p.slug, price: p.price, quantity });
    }

    // reserve stock atomically; roll back on any failure
    for (const line of lines) {
      const r = await Product.updateOne(
        { _id: line.product, quantity: { $gte: line.quantity } },
        { $inc: { quantity: -line.quantity } }
      );
      if (!r.modifiedCount) {
        await restock(reserved);
        throw fail(409, `Not enough stock for ${line.name}`);
      }
      reserved.push(line);
    }

    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    let order;
    try {
      order = await new Order({
        user: req.user.userID,
        items: lines,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total: subtotal + DELIVERY_FEE,
        shippingAddress: ship,
        paymentMethod,
      }).save();
    } catch (e) {
      await restock(reserved);
      throw e;
    }

    res.status(201).send({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    send(res, error, "Error while placing order");
  }
};

const myOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userID }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    send(res, error, "Error while getting orders");
  }
};

const myOrderController = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.userID });
    if (!order) throw fail(404, "Order not found");
    res.status(200).send({ success: true, order });
  } catch (error) {
    if (error.name === "CastError") return res.status(404).send({ success: false, message: "Order not found" });
    send(res, error, "Error while getting order");
  }
};

const cancelOrderController = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.userID });
    if (!order) throw fail(404, "Order not found");
    if (order.status !== "Pending") throw fail(400, "Only pending orders can be cancelled");
    // conditional update so a concurrent status change can't double-restock
    const r = await Order.updateOne({ _id: order._id, status: "Pending" }, { status: "Cancelled" });
    if (!r.modifiedCount) throw fail(400, "Only pending orders can be cancelled");
    await restock(order.items);
    order.status = "Cancelled";
    res.status(200).send({ success: true, message: "Order cancelled", order });
  } catch (error) {
    if (error.name === "CastError") return res.status(404).send({ success: false, message: "Order not found" });
    send(res, error, "Error while cancelling order");
  }
};

// ---------- admin ----------
const allOrdersController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      if (!STATUSES.includes(req.query.status)) throw fail(400, "Invalid status");
      filter.status = req.query.status;
    }
    const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    send(res, error, "Error while getting orders");
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) throw fail(400, "Invalid status");
    const order = await Order.findById(req.params.id);
    if (!order) throw fail(404, "Order not found");
    if (FINAL.includes(order.status)) throw fail(400, `A ${order.status.toLowerCase()} order cannot be changed`);
    if (status === order.status) return res.status(200).send({ success: true, message: "No change", order });

    const r = await Order.updateOne({ _id: order._id, status: order.status }, { status });
    if (!r.modifiedCount) throw fail(409, "Order was changed by someone else, reload and retry");
    if (status === "Cancelled") await restock(order.items);
    order.status = status;
    res.status(200).send({ success: true, message: "Status updated", order });
  } catch (error) {
    if (error.name === "CastError") return res.status(404).send({ success: false, message: "Order not found" });
    send(res, error, "Error while updating status");
  }
};

const statsController = async (req, res) => {
  try {
    const [orders, pending, users, paid] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: "Pending" }),
      User.countDocuments({}),
      Order.find({ status: { $ne: "Cancelled" } }).select("total"),
    ]);
    const revenue = paid.reduce((s, o) => s + o.total, 0);
    res.status(200).send({ success: true, orders, pending, revenue, users });
  } catch (error) {
    send(res, error, "Error while getting stats");
  }
};

module.exports = {
  createOrderController, myOrdersController, myOrderController, cancelOrderController,
  allOrdersController, updateStatusController, statsController,
};
