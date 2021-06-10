const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// the below schema belongs to the products which are in the cart
const CartProductSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
    },
    name: String,
    count: Number,
    price: Number,
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    products: [CartProductSchema],
    trasaction_id: {},
    amount: {
      type: Number,
    },
    address: String,
    status: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

var Order = mongoose.model("Order", OrderSchema);
var CartProduct = mongoose.model("CartProduct", CartProductSchema);
module.exports = { Order, CartProduct };
