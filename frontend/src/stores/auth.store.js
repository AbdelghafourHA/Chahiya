// stores/auth.store.js
import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import i18n from "../i18n"; // 👈 Imported

const useAuth = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  authChecked: false,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/admin/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
      });

      toast.success(i18n.t("login.success", "تم تسجيل الدخول بنجاح!"));
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
        authChecked: true,
      });
      toast.error(
        error.response?.data?.message ||
          i18n.t("login.error", "خطأ في تسجيل الدخول!")
      );
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
      toast.success(i18n.t("login.logoutSuccess", "تم تسجيل الخروج بنجاح!"));
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        authChecked: true,
      });
      toast.error(i18n.t("login.logoutError", "خطأ في تسجيل الخروج!"));
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("adminToken");
      if (!token) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          authChecked: true,
        });
        return;
      }

      const response = await api.get("/admin/check-auth");

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
      });
    } catch (error) {
      localStorage.removeItem("adminToken");
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
