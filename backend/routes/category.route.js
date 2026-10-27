// server/routes/category.route.js
import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post("/", protect, createCategory);

router.put("/:id", protect, updateCategory);

router.delete("/:id", protect, deleteCategory);

export default router;
