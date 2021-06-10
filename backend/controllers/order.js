const { Order, CartProduct } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found",
        });
      }
      req.order = order;
      next();
    });
};

// create order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({ error: "Failed to save your order in db" });
    }
    res.json(order);
  });
};

// get all orders by all the users
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: "No orders found in db" });
      }
      res.json(orders);
    });
};

// getorderstatus and updateorderstatus by admin controllers
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  //
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Not able to update the order status" });
      }
      res.json(order);
    }
  );
};
