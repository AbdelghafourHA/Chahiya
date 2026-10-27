// server/controllers/category.controller.js
import Category from "../models/category.model.js";
import Food from "../models/food.model.js";

/* -------------------------------------------------------------------------- */
/*                              Helpers                                       */
/* -------------------------------------------------------------------------- */

const slugify = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");

// Ensure the slug is unique (append -2, -3 ... if taken)
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug || "category";
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Category.findOne(query);
    if (!exists) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

/* -------------------------------------------------------------------------- */
/*                      GET /api/categories                                   */
/*                      Query: ?activeOnly=true                               */
/* -------------------------------------------------------------------------- */
export const getCategories = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const filter = {};
    if (activeOnly === "true") filter.isActive = true;

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                      GET /api/categories/:id                               */
/* -------------------------------------------------------------------------- */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("getCategoryById error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                      POST /api/categories                                  */
/* -------------------------------------------------------------------------- */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, emoji, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const finalSlug = await ensureUniqueSlug(slugify(slug || name));

    // If order not provided, append to the end
    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const last = await Category.findOne().sort({ order: -1 });
      finalOrder = last ? last.order + 1 : 0;
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      emoji: emoji || "🍽️",
      order: finalOrder,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("createCategory error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this name or slug already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                      PUT /api/categories/:id                               */
/*                      Cascades slug changes to Food.category                */
/* -------------------------------------------------------------------------- */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const { name, slug, emoji, order, isActive } = req.body;
    const oldSlug = category.slug;

    // If slug changes, ensure uniqueness
    let newSlug = oldSlug;
    if (slug !== undefined && slug !== oldSlug) {
      newSlug = await ensureUniqueSlug(slugify(slug), category._id);
    }

    if (name !== undefined) category.name = name.trim();
    category.slug = newSlug;
    if (emoji !== undefined) category.emoji = emoji;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    // Cascade: rename slug on all foods that referenced the old slug
    let updatedFoodsCount = 0;
    if (oldSlug !== newSlug) {
      const result = await Food.updateMany(
        { category: oldSlug },
        { $set: { category: newSlug } }
      );
      updatedFoodsCount = result.modifiedCount;
    }

    res.status(200).json({
      success: true,
      category,
      cascade: {
        slugChanged: oldSlug !== newSlug,
        foodsUpdated: updatedFoodsCount,
      },
    });
  } catch (error) {
    console.error("updateCategory error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this name or slug already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                      DELETE /api/categories/:id                            */
/*                      Query: ?force=true to delete even if products exist   */
/* -------------------------------------------------------------------------- */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const { force } = req.query;

    // Check how many foods reference this category
    const foodCount = await Food.countDocuments({ category: category.slug });

    if (foodCount > 0 && force !== "true") {
      return res.status(409).json({
        success: false,
        message: `Cannot delete: ${foodCount} product(s) still use this category. Move or delete them first, or retry with ?force=true.`,
        foodCount,
      });
    }

    // If forced, unset the category on those foods (they keep working but lose categorization)
    if (foodCount > 0 && force === "true") {
      await Food.updateMany(
        { category: category.slug },
        { $set: { category: "" } }
      );
    }

    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: "Category deleted",
      deletedSlug: category.slug,
      unlinkedFoods: foodCount,
    });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
