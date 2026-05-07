// controllers/food.controller.js
import Food from "../models/food.model.js";
import cloudinary from "../lib/cloudinary.js";

// Get all foods with pagination
export const getAllFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, isAvailable } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

    const [foods, total] = await Promise.all([
      Food.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Food.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      foods,
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
    console.error("Fetch foods error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
      error: error.message,
    });
  }
};

// Get foods by category with pagination
export const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const validCategories = ["pizza", "tacos", "burger", "drink"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const filter = { category, isAvailable: true };

    const [foods, total] = await Promise.all([
      Food.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Food.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      category,
      foods,
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
    console.error("Fetch foods by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods by category",
      error: error.message,
    });
  }
};

// Get single food
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.error("Fetch food error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food",
      error: error.message,
    });
  }
};

// Add new food
export const addFood = async (req, res) => {
  try {
    console.log("=== ADD FOOD DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file ? "File received" : "No file");
    console.log("File mimetype:", req.file?.mimetype);
    console.log("File size:", req.file?.size);

    const { title, price, category, discount = 0 } = req.body;
    const file = req.file;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and category are required",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    // Convert buffer to base64 for Cloudinary
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    console.log("Uploading to Cloudinary...");

    // Upload to Cloudinary using base64
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "restaurant/foods",
      transformation: [{ width: 500, height: 500, crop: "fill" }],
    });

    console.log("Cloudinary upload success:", result.secure_url);

    const newFood = new Food({
      title,
      price,
      category,
      discount: discount || 0,
      image: result.secure_url,
    });

    await newFood.save();
    console.log("Food saved to database:", newFood._id);

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      food: newFood,
    });
  } catch (error) {
    console.error("Add food error DETAILS:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add food",
      error: error.message,
    });
  }
};

// Edit food
export const editFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category, discount } = req.body;
    const file = req.file;

    console.log("Edit food:", {
      id,
      title,
      price,
      category,
      discount,
      hasFile: !!file,
    });

    const existingFood = await Food.findById(id);
    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Update fields if provided
    if (title) existingFood.title = title;
    if (price) existingFood.price = price;
    if (category) existingFood.category = category;
    if (discount !== undefined) existingFood.discount = discount;

    if (file) {
      // Delete old image from Cloudinary
      try {
        const urlParts = existingFood.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `restaurant/foods/${filename.split(".")[0]}`;
        console.log("Deleting old image from Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }

      // Upload new image
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "restaurant/foods",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });
      existingFood.image = result.secure_url;
    }

    await existingFood.save();

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food: existingFood,
    });
  } catch (error) {
    console.error("Edit food error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update food",
      error: error.message,
    });
  }
};

// Remove food
export const removeFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Delete from Cloudinary
    try {
      const urlParts = food.image.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = `restaurant/foods/${filename.split(".")[0]}`;
      console.log("Deleting from Cloudinary:", publicId);
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
    }

    // Delete from database
    await Food.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Delete food error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete food",
      error: error.message,
    });
  }
};

// Apply discount to single food
export const discountToSingleFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    food.discount = discount;
    await food.save();

    res.status(200).json({
      success: true,
      message: `Discount of ${discount}% applied to ${food.title}`,
      food,
    });
  } catch (error) {
    console.error("Apply discount error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply discount",
      error: error.message,
    });
  }
};

// Apply discount to entire category
export const discountToCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { discount } = req.body;

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    const validCategories = ["pizza", "tacos", "burger", "drink"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const result = await Food.updateMany({ category }, { discount });

    const updatedFoods = await Food.find({ category });

    res.status(200).json({
      success: true,
      message: `Discount of ${discount}% applied to ${result.modifiedCount} items in ${category} category`,
      count: result.modifiedCount,
      foods: updatedFoods,
    });
  } catch (error) {
    console.error("Apply category discount error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply discount to category",
      error: error.message,
    });
  }
};

// Apply discount to all foods
export const discountToAll = async (req, res) => {
  try {
    const { discount } = req.body;

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    const result = await Food.updateMany({}, { discount });
    const updatedFoods = await Food.find();

    res.status(200).json({
      success: true,
      message: `Discount of ${discount}% applied to all ${result.modifiedCount} food items`,
      count: result.modifiedCount,
      foods: updatedFoods,
    });
  } catch (error) {
    console.error("Apply all discount error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply discount to all foods",
      error: error.message,
    });
  }
};

// Remove discount from single food
export const removeDiscountFromSingle = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    food.discount = 0;
    await food.save();

    res.status(200).json({
      success: true,
      message: `Discount removed from ${food.title}`,
      food,
    });
  } catch (error) {
    console.error("Remove discount error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove discount",
      error: error.message,
    });
  }
};

// Remove discount from entire category
export const removeDiscountFromCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ["pizza", "tacos", "burger", "drink"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const result = await Food.updateMany({ category }, { discount: 0 });
    const updatedFoods = await Food.find({ category });

    res.status(200).json({
      success: true,
      message: `Discount removed from ${result.modifiedCount} items in ${category} category`,
      count: result.modifiedCount,
      foods: updatedFoods,
    });
  } catch (error) {
    console.error("Remove category discount error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove discount from category",
      error: error.message,
    });
  }
};

// Remove discount from all foods
export const removeDiscountFromAll = async (req, res) => {
  try {
    const result = await Food.updateMany({}, { discount: 0 });
    const updatedFoods = await Food.find();

    res.status(200).json({
      success: true,
      message: `Discount removed from all ${result.modifiedCount} food items`,
      count: result.modifiedCount,
      foods: updatedFoods,
    });
  } catch (error) {
    console.error("Remove all discounts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove discounts from all foods",
      error: error.message,
    });
  }
};

// Toggle food availability
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.status(200).json({
      success: true,
      message: `Food ${food.isAvailable ? "available" : "unavailable"}`,
      food,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle availability",
      error: error.message,
    });
  }
};
