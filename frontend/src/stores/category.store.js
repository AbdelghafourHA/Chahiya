// client/src/stores/category.store.js
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Attach auth token from localStorage if present
const authHeaders = () => {
  const token = localStorage.getItem("adminToken"); // ← FIXED: was "token"
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const useCategory = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  /* ---------------------------------------------------------------------- */
  /*                          GET all categories                            */
  /*  activeOnly: true  → only isActive=true (for Menu/Order)               */
  /*  activeOnly: false → all categories (for Dashboard)                    */
  /* ---------------------------------------------------------------------- */
  fetchCategories: async (activeOnly = false) => {
    set({ loading: true, error: null });
    try {
      const url = `${API_URL}/category${activeOnly ? "?activeOnly=true" : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ loading: false, error: data.message || "Failed to fetch" });
        return { success: false, message: data.message };
      }

      set({
        categories: data.categories,
        loading: false,
        error: null,
      });
      return { success: true, categories: data.categories };
    } catch (err) {
      console.error("fetchCategories error:", err);
      set({ loading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* ---------------------------------------------------------------------- */
  /*                          POST create category                          */
  /* ---------------------------------------------------------------------- */
  addCategory: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ loading: false, error: data.message || "Failed to add" });
        return { success: false, message: data.message };
      }

      const updated = [...get().categories, data.category].sort(
        (a, b) => a.order - b.order
      );
      set({ categories: updated, loading: false, error: null });
      return { success: true, category: data.category };
    } catch (err) {
      console.error("addCategory error:", err);
      set({ loading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* ---------------------------------------------------------------------- */
  /*                          PUT update category                           */
  /*  Backend cascades slug changes to all products automatically           */
  /* ---------------------------------------------------------------------- */
  editCategory: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ loading: false, error: data.message || "Failed to update" });
        return { success: false, message: data.message };
      }

      const updated = get()
        .categories.map((c) => (c._id === id ? data.category : c))
        .sort((a, b) => a.order - b.order);

      set({ categories: updated, loading: false, error: null });
      return {
        success: true,
        category: data.category,
        cascade: data.cascade,
      };
    } catch (err) {
      console.error("editCategory error:", err);
      set({ loading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* ---------------------------------------------------------------------- */
  /*                          DELETE category                               */
  /*  Returns foodCount on 409 so the UI can show "X products use this"     */
  /* ---------------------------------------------------------------------- */
  removeCategory: async (id, force = false) => {
    set({ loading: true, error: null });
    try {
      const url = `${API_URL}/category/${id}${force ? "?force=true" : ""}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ loading: false, error: data.message || "Failed to delete" });
        return {
          success: false,
          message: data.message,
          foodCount: data.foodCount,
        };
      }

      set({
        categories: get().categories.filter((c) => c._id !== id),
        loading: false,
        error: null,
      });
      return {
        success: true,
        deletedSlug: data.deletedSlug,
        unlinkedFoods: data.unlinkedFoods,
      };
    } catch (err) {
      console.error("removeCategory error:", err);
      set({ loading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCategory;
