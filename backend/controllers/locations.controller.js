// controllers/locations.controller.js
import Location from "../models/location.model.js";

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.error("Fetch locations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
};

// Add new location
export const addLocation = async (req, res) => {
  try {
    const { title, price } = req.body;

    console.log("=== ADD LOCATION DEBUG ===");
    console.log("Request body:", req.body);

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    const location = new Location({
      title,
      price,
    });

    await location.save();
    console.log("Location saved to database:", location._id);

    res.status(201).json({
      success: true,
      message: "Location added successfully",
      location,
    });
  } catch (error) {
    console.error("Add location error DETAILS:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add location",
      error: error.message,
    });
  }
};

// Edit location
export const editLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    console.log("Edit location:", { id, title, price });

    const existingLocation = await Location.findById(id);
    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    if (title) existingLocation.title = title;
    if (price !== undefined) existingLocation.price = price;

    await existingLocation.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: existingLocation,
    });
  } catch (error) {
    console.error("Edit location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update location",
      error: error.message,
    });
  }
};

// Remove location
export const removeLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await Location.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Delete location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete location",
      error: error.message,
    });
  }
};
