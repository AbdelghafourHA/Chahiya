// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ManageProducts from "../sections/ManageProducts";
import AddProduct from "../sections/AddProduct";
import Locations from "../sections/Locations";
import Categories from "../sections/Categories";
// import Orders from "../sections/Orders";
import useFood from "../stores/food.store";
import useAuth from "../stores/auth.store";
import ThemeToggle from "../components/ThemeToggle.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function Dashboard() {
  const [tab, setTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { fetchAllFoods } = useFood();
  const { checkAuth, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tabs = [
    { id: "products", name: t("dashboard.products") },
    { id: "add", name: t("dashboard.addProduct") },
    { id: "categories", name: t("dashboard.categories") },
    { id: "locations", name: t("dashboard.locations") },
    // { id: "orders", name: t("dashboard.orders", "الطلبات") },
  ];

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="text-text text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">{t("admin.verify")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="min-h-screen bg-background text-text py-6 transition-colors duration-300">
      <div className="container max-w-6xl mx-auto px-4 space-y-6">
        {/* Header with Toggle + Logout */}
        <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
          <div className="">
            <h1 className="text-center font-heading text-2xl font-bold">
              {t("dashboard.title")}
            </h1>
            {user && (
              <p className="text-center text-muted text-sm mt-1">
                {t("admin.welcome")} {user.fullName || user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? t("admin.loggingOut") : t("admin.logout")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
          {tabs.map((tObj) => (
            <button
              key={tObj.id}
              onClick={() => setTab(tObj.id)}
              className={`text-sm px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                tab === tObj.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted border-border hover:bg-border hover:text-text"
              }`}
            >
              {tObj.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "products" && <ManageProducts />}
          {tab === "add" && <AddProduct onSuccess={handleProductAdded} />}
          {tab === "categories" && <Categories />}
          {tab === "locations" && <Locations />}
          {/* {tab === "orders" && <Orders />} */}
        </div>
      </div>
    </section>
  );
}
