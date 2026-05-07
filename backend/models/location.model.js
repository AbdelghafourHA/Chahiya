import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Location title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Delivery price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
