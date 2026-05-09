import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Food title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["pizza", "tacos", "burger", "drink"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

foodSchema.pre("save", function () {
  this.discountedPrice = this.price - (this.price * this.discount) / 100;
});

foodSchema.index({ category: 1, isAvailable: 1 });
foodSchema.index({ title: "text" });
foodSchema.index({ createdAt: -1 });

const Food = mongoose.model("Food", foodSchema);

export default Food;
