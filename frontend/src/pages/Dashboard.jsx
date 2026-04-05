import { useState } from "react";
import ManageProducts from "../sections/ManageProducts";
import AddProduct from "../sections/AddProduct";
import Locations from "../sections/Locations";
import Orders from "../sections/Orders";

export default function Dashboard() {
  const [tab, setTab] = useState("products");

  const tabs = [
    { id: "products", name: "المنتجات" },
    { id: "add", name: "إضافة" },
    { id: "locations", name: "التوصيل" },
    { id: "orders", name: "الطلبات" },
  ];

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white py-6">
      <div className="container max-w-6xl space-y-6">
        <h1 className="text-center font-heading text-xl">لوحة التحكم</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition
                ${tab === t.id ? "bg-primary" : "bg-[#161616] text-white/60"}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "products" && <ManageProducts />}
        {tab === "add" && <AddProduct />}
        {tab === "locations" && <Locations />}
        {tab === "orders" && <Orders />}
      </div>
    </section>
  );
}
