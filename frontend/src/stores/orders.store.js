// stores/orders.store.js
import { create } from "zustand";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const useOrders = create((set, get) => ({
  loading: false,
  error: null,
  stats: null,

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/orders", orderData);
      set({ loading: false });
      toast.success("تم إرسال الطلب بنجاح!");
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error("Create order error:", error);
      const message = error.response?.data?.message || "فشل في إرسال الطلب";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchAllOrders: async (page = 1, limit = 10, filters = {}) => {
    try {
      set({ loading: true, error: null });
      const params = { page, limit, ...filters };
      const response = await api.get("/orders", { params });
      set({ loading: false });
      return {
        success: true,
        orders: response.data.orders,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Fetch orders error:", error);
      const message = error.response?.data?.message || "فشل في جلب الطلبات";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchOrderById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/orders/${id}`);
      set({ loading: false });
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error("Fetch order error:", error);
      const message = error.response?.data?.message || "فشل في جلب الطلب";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch(`/orders/${id}/status`, { status });
      set({ loading: false });
      toast.success(`تم تحديث حالة الطلب إلى ${getStatusText(status)}`);
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error("Update order status error:", error);
      const message =
        error.response?.data?.message || "فشل في تحديث حالة الطلب";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteOrder: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/orders/${id}`);
      set({ loading: false });
      toast.success("تم حذف الطلب بنجاح");
      return { success: true };
    } catch (error) {
      console.error("Delete order error:", error);
      const message = error.response?.data?.message || "فشل في حذف الطلب";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchOrderStats: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/orders/stats");
      set({ loading: false, stats: response.data.stats });
      return { success: true, stats: response.data.stats };
    } catch (error) {
      console.error("Fetch order stats error:", error);
      const message = error.response?.data?.message || "فشل في جلب الإحصائيات";
      set({ loading: false, error: message });
      toast.error(message);
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),
}));

const getStatusText = (status) => {
  const statusMap = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    preparing: "قيد التحضير",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return statusMap[status] || status;
};

export default useOrders;
