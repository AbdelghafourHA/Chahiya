// sections/Orders.jsx
import { useState, useEffect } from "react";
import useOrders from "../stores/orders.store";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersPagination, setOrdersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { fetchAllOrders, updateOrderStatus, deleteOrder } = useOrders();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const result = await fetchAllOrders(currentPage, 10, {
        status: statusFilter,
        search: searchTerm,
      });
      if (result && result.success) {
        setOrders(result.orders);
        setOrdersPagination(result.pagination);
      }
      setLoading(false);
    };
    loadOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    preparing: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
    delivered: "bg-green-500/20 text-green-600 dark:text-green-400",
    cancelled: "bg-red-500/20 text-red-600 dark:text-red-400",
  };

  const statusText = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    preparing: "قيد التحضير",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await updateOrderStatus(id, newStatus);
    if (result.success && selectedOrder?._id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setOrders(
        orders.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      const result = await deleteOrder(id);
      if (result.success) {
        setOrders(orders.filter((o) => o._id !== id));
        setSelectedOrder(null);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border p-4 rounded-2xl animate-pulse"
          >
            <div className="h-5 bg-border rounded w-32 mb-2"></div>
            <div className="h-4 bg-border rounded w-24 mb-2"></div>
            <div className="h-4 bg-border rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter("")}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
              statusFilter === ""
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-border border-border text-muted hover:bg-muted/30 hover:text-text"
            }`}
          >
            الكل
          </button>
          {Object.entries(statusText).map(([key, text]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
                statusFilter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-border border-border text-muted hover:bg-muted/30 hover:text-text"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="بحث بالاسم أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-background border border-border text-text placeholder:text-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border p-8 rounded-2xl text-center">
          <p className="text-muted">لا توجد طلبات</p>
          <p className="text-sm text-muted mt-2">سيظهر هنا الطلبات الجديدة</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="bg-surface border border-border p-4 rounded-2xl cursor-pointer hover:bg-surface/80 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">{order.customer.fullName}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    statusColors[order.status]
                  }`}
                >
                  {statusText[order.status]}
                </span>
              </div>
              <p className="text-xs text-muted">{order.shippingPlace}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted">
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-xs text-primary font-semibold">
                  {order.totalPrice} دج
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {ordersPagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!ordersPagination.hasPrevPage}
            className="px-3 py-1 bg-surface border border-border text-text rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition"
          >
            السابق
          </button>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm">
            {ordersPagination.currentPage} / {ordersPagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!ordersPagination.hasNextPage}
            className="px-3 py-1 bg-surface border border-border text-text rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition"
          >
            التالي
          </button>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border text-text w-full max-w-md rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-lg">تفاصيل الطلب</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  statusColors[selectedOrder.status]
                }`}
              >
                {statusText[selectedOrder.status]}
              </span>
            </div>
            <div className="bg-background border border-border p-3 rounded-xl text-xs space-y-2">
              <p className="flex justify-between">
                <span className="text-muted">👤 الاسم:</span>
                <span className="font-medium">
                  {selectedOrder.customer.fullName}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">📞 الهاتف:</span>
                <span className="font-medium" dir="ltr">
                  {selectedOrder.customer.phone}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">📍 الموقع:</span>
                <span className="font-medium">
                  {selectedOrder.shippingPlace}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">🕒 التاريخ:</span>
                <span className="font-medium">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </p>
            </div>
            <hr className="border-border" />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">المنتجات</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.quantity} × {item.price} دج
                    </p>
                  </div>
                  <p className="text-sm text-primary">
                    {item.price * item.quantity} دج
                  </p>
                </div>
              ))}
            </div>
            <hr className="border-border" />
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">المجموع الفرعي:</span>
                <span>{selectedOrder.itemsPrice} دج</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">سعر التوصيل:</span>
                <span>{selectedOrder.shippingPrice} دج</span>
              </div>
              <div className="flex justify-between font-heading text-primary text-base pt-2 border-t border-border">
                <span>الإجمالي:</span>
                <span>{selectedOrder.totalPrice} دج</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted">تحديث حالة الطلب:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "pending",
                  "confirmed",
                  "preparing",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusUpdate(selectedOrder._id, status)
                    }
                    disabled={selectedOrder.status === status}
                    className={`text-xs px-3 py-1.5 rounded-full transition ${
                      selectedOrder.status === status
                        ? statusColors[status]
                        : "bg-border text-muted hover:bg-muted/30 hover:text-text"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {statusText[status]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDelete(selectedOrder._id)}
                className="flex-1 bg-red-500/20 text-red-500 dark:text-red-400 py-2 rounded-xl text-sm hover:bg-red-500/30 transition"
              >
                حذف الطلب
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-border text-text py-2 rounded-xl text-sm hover:bg-muted/30 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
