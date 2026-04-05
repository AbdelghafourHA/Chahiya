import { useState } from "react";

export default function ManageProducts() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const products = [
    { _id: "1", name: "بيتزا دجاج", price: 1200 },
    { _id: "2", name: "تاكوس", price: 900 },
  ];

  const filtered = products.filter((p) => p.name.includes(search));

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 bg-[#161616] rounded-xl text-sm outline-none"
      />

      {/* Empty */}
      {filtered.length === 0 && (
        <p className="text-center text-white/50 text-sm">لا توجد نتائج</p>
      )}

      {/* Products */}
      {filtered.map((p) => (
        <div
          key={p._id}
          className="bg-[#161616] p-4 rounded-2xl flex justify-between items-center hover:bg-[#1f1f1f] transition"
        >
          <div>
            <p className="text-sm">{p.name}</p>
            <p className="text-xs text-primary">{p.price} دج</p>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setSelected(p)}
              className="bg-[#222] px-3 py-1 rounded"
            >
              تعديل
            </button>
            <button className="bg-red-500 px-3 py-1 rounded">حذف</button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161616] p-5 rounded-2xl w-[90%] max-w-sm space-y-3">
            <h3 className="text-sm font-heading">تعديل المنتج</h3>

            <input
              defaultValue={selected.name}
              className="w-full p-2 bg-[#111] rounded"
            />

            <input
              defaultValue={selected.price}
              className="w-full p-2 bg-[#111] rounded"
            />

            <div className="flex gap-2">
              <button className="flex-1 bg-primary py-2 rounded">حفظ</button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-[#222] py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
