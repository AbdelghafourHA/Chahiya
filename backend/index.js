import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

import adminRoutes from "./routes/admin.route.js";
import foodRoutes from "./routes/food.route.js";
import locationsRoutes from "./routes/locations.route.js";
import ordersRoutes from "./routes/order.route.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
