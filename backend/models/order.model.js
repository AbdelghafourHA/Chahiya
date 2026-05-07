// models/Order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },
    shippingPlace: {
      type: String,
      required: [true, "Shipping place is required"],
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: [0, "Shipping price cannot be negative"],
      default: 0,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: [0, "Items price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
orderSchema.pre("save", function () {
  this.itemsPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.totalPrice = this.itemsPrice + this.shippingPrice;
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
