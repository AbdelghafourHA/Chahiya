// pages/Dashboard.jsx (Simple version without icons)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManageProducts from "../sections/ManageProducts";
import AddProduct from "../sections/AddProduct";
import Locations from "../sections/Locations";
import Orders from "../sections/Orders";
import useFood from "../stores/food.store";
import useAuth from "../stores/auth.store";

export default function Dashboard() {
  const [tab, setTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { fetchAllFoods } = useFood();
  const { checkAuth, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: "products", name: "المنتجات" },
    { id: "add", name: "إضافة منتج" },
    { id: "locations", name: "مواقع التوصيل" },
    { id: "orders", name: "الطلبات" },
  ];

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Refresh products when switching to products tab (only if authenticated)
  useEffect(() => {
    if (!isLoading && isAuthenticated && tab === "products") {
      fetchAllFoods(1, 10);
    }
  }, [tab, fetchAllFoods, isLoading, isAuthenticated]);

  const handleProductAdded = () => {
    setTab("products");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate("/login");
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render dashboard (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white py-6">
      <div className="container max-w-6xl mx-auto px-4 space-y-6">
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-center font-heading text-2xl font-bold">
              لوحة التحكم
            </h1>
            {user && (
              <p className="text-center text-white/40 text-sm mt-1">
                مرحباً, {user.fullName || user.email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200
                ${
                  tab === t.id
                    ? "bg-primary text-white"
                    : "bg-[#161616] text-white/60 hover:bg-[#202020] hover:text-white/80"
                }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "products" && <ManageProducts />}
          {tab === "add" && <AddProduct onSuccess={handleProductAdded} />}
          {tab === "locations" && <Locations />}
          {tab === "orders" && <Orders />}
        </div>
      </div>
    </section>
  );
}
