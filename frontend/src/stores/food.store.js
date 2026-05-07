// stores/food.store.js
import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const useFood = create((set, get) => ({
  loading: false,
  error: null,

  // Fetch all foods with pagination - returns data, doesn't store
  fetchAllFoods: async (page = 1, limit = 10, filters = {}) => {
    try {
      set({ loading: true, error: null });
      const params = { page, limit, ...filters };
      const response = await api.get("/food", { params });
      set({ loading: false });
      return {
        success: true,
        foods: response.data.foods,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Fetch foods error:", error);
      const message = error.response?.data?.message || "Failed to fetch foods";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Fetch foods by category - returns data, doesn't store
  fetchFoodsByCategory: async (category, page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const params = { page, limit };
      const response = await api.get(`/food/category/${category}`, { params });
      set({ loading: false });
      return {
        success: true,
        foods: response.data.foods,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Fetch foods by category error:", error);
      const message =
        error.response?.data?.message || "Failed to fetch foods by category";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Fetch single food
  fetchFoodById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/food/${id}`);
      set({ loading: false });
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Fetch food error:", error);
      const message = error.response?.data?.message || "Failed to fetch food";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Add new food
  addFood: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      toast.success("تم إضافة المنتج بنجاح");
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Add food error:", error);
      const message = error.response?.data?.message || "Failed to add food";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Edit food
  editFood: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/food/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      toast.success("تم تحديث المنتج بنجاح");
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Edit food error:", error);
      const message = error.response?.data?.message || "Failed to update food";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Remove food
  removeFood: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/food/${id}`);
      set({ loading: false });
      toast.success("تم حذف المنتج بنجاح");
      return { success: true };
    } catch (error) {
      console.error("Delete food error:", error);
      const message = error.response?.data?.message || "Failed to delete food";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Apply discount to single food
  applyDiscountToSingle: async (id, discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/single/${id}`, {
        discount,
      });
      set({ loading: false });
      toast.success(`تم تطبيق خصم ${discount}% بنجاح`);
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Apply discount error:", error);
      const message =
        error.response?.data?.message || "Failed to apply discount";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Apply discount to entire category
  applyDiscountToCategory: async (category, discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/category/${category}`, {
        discount,
      });
      set({ loading: false });
      toast.success(`تم تطبيق خصم ${discount}% على جميع منتجات ${category}`);
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Apply category discount error:", error);
      const message =
        error.response?.data?.message || "Failed to apply discount to category";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Apply discount to all foods
  applyDiscountToAll: async (discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("/food/discount/all", { discount });
      set({ loading: false });
      toast.success(`تم تطبيق خصم ${discount}% على جميع المنتجات`);
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Apply all discount error:", error);
      const message =
        error.response?.data?.message || "Failed to apply discount to all";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Remove discount from single food
  removeDiscountFromSingle: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/remove/single/${id}`);
      set({ loading: false });
      toast.success("تم إزالة الخصم بنجاح");
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Remove discount error:", error);
      const message =
        error.response?.data?.message || "Failed to remove discount";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Remove discount from entire category
  removeDiscountFromCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(
        `/food/discount/remove/category/${category}`
      );
      set({ loading: false });
      toast.success(`تم إزالة الخصم من جميع منتجات ${category}`);
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Remove category discount error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to remove discount from category";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Remove discount from all foods
  removeDiscountFromAll: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("/food/discount/remove/all");
      set({ loading: false });
      toast.success("تم إزالة الخصم من جميع المنتجات");
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Remove all discounts error:", error);
      const message =
        error.response?.data?.message || "Failed to remove discounts";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Toggle food availability
  toggleAvailability: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/toggle/${id}`);
      set({ loading: false });
      toast.success(
        `المنتج ${response.data.food.isAvailable ? "متاح" : "غير متاح"}`
      );
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Toggle availability error:", error);
      const message =
        error.response?.data?.message || "Failed to toggle availability";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useFood;
