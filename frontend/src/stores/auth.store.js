import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const useAuth = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  authChecked: false, // Add this to track if auth has been checked

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/admin/login", { email, password });

      // Store token in localStorage for iOS fallback
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
      });
      toast.success("تم تسجيل الدخول بنجاح!");
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
        authChecked: true,
      });
      toast.error(error.response?.data?.message || "خطأ في تسجيل الدخول!");
      return false;
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await api.post("/admin/logout");
      localStorage.removeItem("adminToken");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        authChecked: true,
      });
      toast.success("تم تسجيل الخروج بنجاح!");
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        authChecked: true,
      });
      toast.error("خطاء في تسجيل الخروج!");
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });

      // Get token from localStorage if exists
      const token = localStorage.getItem("adminToken");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const response = await api.get("/admin/check-auth");

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
      });
    } catch (error) {
      // Clear token if check fails
      localStorage.removeItem("adminToken");
      delete api.defaults.headers.common["Authorization"];

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        authChecked: true,
        error: null,
      });
    }
  },
}));

export default useAuth;
