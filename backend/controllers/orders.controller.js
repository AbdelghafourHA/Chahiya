// controllers/orders.controller.js
import Order from "../models/order.model.js";
import { sendOrderNotificationEmail } from "../lib/email.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    console.log("=== CREATE ORDER DEBUG ===");
    console.log("Request body:", req.body);

    const { customer, items, shippingPlace, shippingPrice } = req.body;

    // Validate required fields
    if (!customer || !customer.fullName || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer full name and phone are required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!shippingPlace) {
      return res.status(400).json({
        success: false,
        message: "Shipping place is required",
      });
    }

    // Calculate prices
    const itemsPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalPrice = itemsPrice + (shippingPrice || 0);

    // Create order
    const order = new Order({
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
      },
      items: items.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
      })),
      shippingPlace,
      shippingPrice: shippingPrice || 0,
      itemsPrice,
      totalPrice,
      status: "pending",
    });

    await order.save();
    console.log("✅ Order saved to database:", order._id);

    // Send email notification to admin (don't await - let it run in background)
    sendOrderNotificationEmail(order).catch((err) =>
      console.error("❌ Background email sending failed:", err)
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        customer: order.customer,
        items: order.items,
        shippingPlace: order.shippingPlace,
        shippingPrice: order.shippingPrice,
        itemsPrice: order.itemsPrice,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Create order error DETAILS:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all orders with pagination and filters
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { "customer.fullName": { $regex: req.query.search, $options: "i" } },
        { "customer.phone": { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ Fetch orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Fetch order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("❌ Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get orders statistics (for dashboard)
export const getOrderStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, completedOrders, totalRevenue] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "delivered" }),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Get last 7 days orders
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: last7Days },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("❌ Get order stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
