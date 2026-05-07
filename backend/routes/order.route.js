// routes/orders.route.js
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from "../controllers/orders.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route (no authentication needed for creating order)
router.post("/", createOrder);

// Protected routes (admin only)
router.get("/", protect, getAllOrders);
router.get("/stats", protect, getOrderStats);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, updateOrderStatus);
router.delete("/:id", protect, deleteOrder);

export default router;
