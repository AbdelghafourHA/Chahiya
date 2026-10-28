// stores/food.store.js
import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import i18n from "../i18n"; // 👈 Imported

const useFood = create((set, get) => ({
  loading: false,
  error: null,

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
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodFetchError", "Failed to fetch foods");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

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
        error.response?.data?.message ||
        i18n.t("admin.foodFetchError", "Failed to fetch foods");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchFoodById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/food/${id}`);
      set({ loading: false });
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Fetch food error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodFetchError", "Failed to fetch food");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  addFood: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      toast.success(i18n.t("admin.foodAdded", "تم إضافة المنتج بنجاح"));
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Add food error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodAddError", "Failed to add food");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  editFood: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/food/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      toast.success(i18n.t("admin.foodUpdated", "تم تحديث المنتج بنجاح"));
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Edit food error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodUpdateError", "Failed to update food");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  removeFood: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/food/${id}`);
      set({ loading: false });
      toast.success(i18n.t("admin.foodDeleted", "تم حذف المنتج بنجاح"));
      return { success: true };
    } catch (error) {
      console.error("Delete food error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodDeleteError", "Failed to delete food");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  applyDiscountToSingle: async (id, discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/single/${id}`, {
        discount,
      });
      set({ loading: false });
      toast.success(
        i18n.t("admin.discountApplied", `تم تطبيق خصم ${discount}% بنجاح`, {
          discount,
        })
      );
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Apply discount error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.discountError", "Failed to apply discount");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  applyDiscountToCategory: async (category, discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/category/${category}`, {
        discount,
      });
      set({ loading: false });
      toast.success(
        i18n.t(
          "admin.discountCategoryApplied",
          `تم تطبيق خصم ${discount}% على ${category}`,
          { discount, category }
        )
      );
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Apply category discount error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.discountError", "Failed to apply discount to category");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  applyDiscountToAll: async (discount) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("/food/discount/all", { discount });
      set({ loading: false });
      toast.success(
        i18n.t(
          "admin.discountAllApplied",
          `تم تطبيق خصم ${discount}% على جميع المنتجات`,
          { discount }
        )
      );
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Apply all discount error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.discountError", "Failed to apply discount to all");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  removeDiscountFromSingle: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/discount/remove/single/${id}`);
      set({ loading: false });
      toast.success(i18n.t("admin.discountRemoved", "تم إزالة الخصم بنجاح"));
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Remove discount error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.discountRemoveError", "Failed to remove discount");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  removeDiscountFromCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(
        `/food/discount/remove/category/${category}`
      );
      set({ loading: false });
      toast.success(
        i18n.t(
          "admin.discountCategoryRemoved",
          `تم إزالة الخصم من ${category}`,
          { category }
        )
      );
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Remove category discount error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t(
          "admin.discountRemoveError",
          "Failed to remove discount from category"
        );
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  removeDiscountFromAll: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("/food/discount/remove/all");
      set({ loading: false });
      toast.success(
        i18n.t("admin.discountAllRemoved", "تم إزالة الخصم من جميع المنتجات")
      );
      return { success: true, foods: response.data.foods };
    } catch (error) {
      console.error("Remove all discounts error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.discountRemoveError", "Failed to remove discounts");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  toggleAvailability: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/food/toggle/${id}`);
      set({ loading: false });
      const isAvailable = response.data.food.isAvailable;
      toast.success(
        isAvailable
          ? i18n.t("admin.foodToggledAvailable", "المنتج متاح")
          : i18n.t("admin.foodToggledUnavailable", "المنتج غير متاح")
      );
      return { success: true, food: response.data.food };
    } catch (error) {
      console.error("Toggle availability error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.foodToggleError", "Failed to toggle availability");
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useFood;
