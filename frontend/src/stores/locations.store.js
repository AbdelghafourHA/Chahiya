// stores/locations.store.js
import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import i18n from "../i18n"; // 👈 Imported

const useLocation = create((set, get) => ({
  locations: [],
  loading: false,
  error: null,

  fetchAllLocations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/locations");

      set({
        locations: response.data.locations,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch locations error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.locationFetchError", "Failed to fetch locations");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  addLocation: async (locationData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/locations", locationData);

      set((state) => ({
        locations: [response.data.location, ...state.locations],
        loading: false,
      }));

      toast.success(i18n.t("admin.locationAdded", "تم إضافة الموقع بنجاح!"));
      return { success: true };
    } catch (error) {
      console.error("Add location error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.locationAddError", "Failed to add location");
      set({ error: message, loading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  editLocation: async (id, locationData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/locations/${id}`, locationData);

      set((state) => ({
        locations: state.locations.map((loc) =>
          loc._id === id ? response.data.location : loc
        ),
        loading: false,
      }));

      toast.success(i18n.t("admin.locationUpdated", "تم تحديث الموقع بنجاح!"));
      return { success: true };
    } catch (error) {
      console.error("Edit location error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.locationUpdateError", "Failed to update location");
      set({ error: message, loading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  removeLocation: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/locations/${id}`);

      set((state) => ({
        locations: state.locations.filter((loc) => loc._id !== id),
        loading: false,
      }));

      toast.success(i18n.t("admin.locationDeleted", "تم حذف الموقع بنجاح!"));
      return { success: true };
    } catch (error) {
      console.error("Delete location error:", error);
      const message =
        error.response?.data?.message ||
        i18n.t("admin.locationDeleteError", "Failed to delete location");
      set({ error: message, loading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),

  resetStore: () =>
    set({
      locations: [],
      loading: false,
      error: null,
    }),
}));

export default useLocation;
