// routes/food.route.js
import express from "express";
import {
  getAllFoods,
  getFoodsByCategory,
  getFoodById,
  addFood,
  editFood,
  removeFood,
  discountToSingleFood,
  discountToCategory,
  discountToAll,
  removeDiscountFromSingle,
  removeDiscountFromCategory,
  removeDiscountFromAll,
  toggleAvailability,
} from "../controllers/food.controller.js";
import protect from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

// Public routes (no authentication needed)
router.get("/", getAllFoods);
router.get("/category/:category", getFoodsByCategory);
router.get("/:id", getFoodById);

// Protected routes (admin only - requires authentication)
router.post("/", protect, upload.single("image"), addFood);
router.put("/:id", protect, upload.single("image"), editFood);
router.delete("/:id", protect, removeFood);

// Discount routes (admin only)
router.patch("/discount/single/:id", protect, discountToSingleFood);
router.patch("/discount/category/:category", protect, discountToCategory);
router.patch("/discount/all", protect, discountToAll);

// Remove discount routes (admin only)
router.patch("/discount/remove/single/:id", protect, removeDiscountFromSingle);
router.patch(
  "/discount/remove/category/:category",
  protect,
  removeDiscountFromCategory
);
router.patch("/discount/remove/all", protect, removeDiscountFromAll);

// Toggle availability (admin only)
router.patch("/toggle/:id", protect, toggleAvailability);

export default router;
