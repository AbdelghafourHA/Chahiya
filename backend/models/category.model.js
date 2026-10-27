// server/models/category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [50, "Category slug cannot exceed 50 characters"],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only (e.g., 'pizza', 'soft-drinks')",
      ],
    },
    emoji: {
      type: String,
      default: "🍽️",
      trim: true,
      maxlength: [8, "Emoji must be a single character"],
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
// Modern Mongoose: async (no `next` param) — cannot collide with arity checks
categorySchema.pre("validate", async function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
