// sections/Locations.jsx
import { useState, useEffect } from "react";
import useLocation from "../stores/locations.store";
import { toast } from "react-hot-toast";

export default function Locations() {
  const {
    locations,
    loading,
    fetchAllLocations,
    addLocation,
    editLocation,
    removeLocation,
  } = useLocation();

  const [form, setForm] = useState({
    title: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch locations on component mount
  useEffect(() => {
    fetchAllLocations();
  }, [fetchAllLocations]);

  // ➕ Add
  const handleAdd = async () => {
    if (!form.title.trim()) {
      toast.error("اسم المنطقة مطلوب");
      return;
    }

    if (!form.price || form.price <= 0) {
      toast.error("سعر التوصيل مطلوب");
      return;
    }

    setIsSubmitting(true);
    const result = await addLocation({
      title: form.title,
      price: parseFloat(form.price),
    });

    setIsSubmitting(false);

    if (result.success) {
      setForm({ title: "", price: "" });
    }
  };

  // ✏️ Edit
  const handleEdit = (loc) => {
    setForm({
      title: loc.title,
      price: loc.price,
    });
    setEditingId(loc._id);
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      toast.error("اسم المنطقة مطلوب");
      return;
    }

    if (!form.price || form.price <= 0) {
      toast.error("سعر التوصيل مطلوب");
      return;
    }

    setIsSubmitting(true);
    const result = await editLocation(editingId, {
      title: form.title,
      price: parseFloat(form.price),
    });

    setIsSubmitting(false);

    if (result.success) {
      setEditingId(null);
      setForm({ title: "", price: "" });
    }
  };

  // ❌ Delete
  const handleDelete = async (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
      await removeLocation(id);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", price: "" });
  };

  // Loading state
  if (loading && locations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-[#161616] p-4 rounded-2xl space-y-3 animate-pulse">
          <div className="h-10 bg-[#222] rounded"></div>
          <div className="h-10 bg-[#222] rounded"></div>
          <div className="h-10 bg-[#222] rounded"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#161616] p-4 rounded-xl animate-pulse">
              <div className="h-5 bg-[#222] rounded w-32 mb-2"></div>
              <div className="h-4 bg-[#222] rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-[#161616] p-4 rounded-2xl space-y-3">
        <div className="space-y-2">
          <label className="block text-sm text-white/60">اسم المنطقة</label>
          <input
            type="text"
            placeholder="مثال: وسط المدينة"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/60">
            سعر التوصيل (دج)
          </label>
          <input
            type="number"
            placeholder="مثال: 200"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1 bg-primary py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
              >
                {isSubmitting ? "جاري التحديث..." : "تحديث"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 bg-[#222] py-2 rounded-xl text-sm hover:bg-[#333] transition disabled:opacity-50"
              >
                إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="w-full bg-primary py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة منطقة"}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {locations.length === 0 && !loading ? (
        <div className="bg-[#161616] p-8 rounded-2xl text-center">
          <p className="text-white/60">لا توجد مناطق توصيل</p>
          <p className="text-sm text-white/40 mt-2">
            أضف منطقة جديدة من خلال النموذج أعلاه
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="bg-[#161616] p-4 rounded-xl flex justify-between items-center hover:bg-[#1a1a1a] transition"
            >
              <div>
                <p className="text-sm font-medium">{loc.title}</p>
                <p className="text-xs text-primary mt-1">{loc.price} دج</p>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => handleEdit(loc)}
                  className="bg-[#222] px-3 py-1.5 rounded-lg hover:bg-[#333] transition"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(loc._id, loc.title)}
                  className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
