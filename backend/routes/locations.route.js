// routes/locations.route.js
import express from "express";
import {
  getAllLocations,
  addLocation,
  editLocation,
  removeLocation,
} from "../controllers/locations.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication needed)
router.get("/", getAllLocations);

// Protected routes (admin only)
router.post("/", protect, addLocation);
router.put("/:id", protect, editLocation);
router.delete("/:id", protect, removeLocation);

export default router;
