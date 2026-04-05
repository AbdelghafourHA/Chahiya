import { useState } from "react";

export default function Orders() {
  const [tab, setTab] = useState("pending");

  const orders = [
    { id: 1, name: "محمد", total: 2000, status: "pending" },
    { id: 2, name: "علي", total: 1500, status: "done" },
  ];

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {["pending", "done", "all"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-3 py-1 rounded-full
              ${tab === t ? "bg-primary" : "bg-[#161616]"}
            `}
          >
            {t === "pending" ? "قيد الانتظار" : t === "done" ? "تم" : "الكل"}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.map((o) => (
        <div key={o.id} className="bg-[#161616] p-4 rounded-2xl space-y-2">
          <p className="text-sm">{o.name}</p>
          <p className="text-xs text-primary">{o.total} دج</p>

          <div className="flex gap-2 text-xs">
            <button className="bg-primary px-3 py-1 rounded">تم</button>
            <button className="bg-red-500 px-3 py-1 rounded">حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}
