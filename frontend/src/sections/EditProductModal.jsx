// components/EditProductModal.jsx
import { useState, useEffect } from "react";
import useFood from "../stores/food.store";

export default function EditProductModal({ product, onClose, onEdit }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    discount: 0,
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { editFood } = useFood();

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const categories = [
    { value: "pizza", label: "بيتزا", emoji: "🍕" },
    { value: "tacos", label: "تاكوس", emoji: "🌮" },
    { value: "burger", label: "برغر", emoji: "🍔" },
    { value: "drink", label: "مشروبات", emoji: "🥤" },
  ];

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        price: product.price || "",
        category: product.category || "pizza",
        discount: product.discount || 0,
        image: null,
      });
      setPreview(product.image || "");
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const handleImage = (file) => {
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setError("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار صورة صالحة");
      return;
    }

    setError("");
    setForm({ ...form, image: file });
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("اسم المنتج مطلوب");
      return;
    }

    if (!form.price || form.price <= 0) {
      setError("السعر المطلوب صالح");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("discount", form.discount);
    if (form.image) {
      formData.append("image", form.image);
    }

    // Use the onEdit callback if provided, otherwise use direct editFood
    let result;
    if (onEdit) {
      result = await onEdit(product._id, formData);
    } else {
      result = await editFood(product._id, formData);
    }

    setIsSubmitting(false);

    if (result && result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">تعديل المنتج</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-white/60">اسم المنتج</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/60">السعر (دج)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/60">القسم</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/60">الخصم (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: parseInt(e.target.value) || 0 })
              }
              className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/60">
              صورة جديدة (اختياري)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files[0])}
              className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer"
              disabled={isSubmitting}
            />
            {preview && (
              <img
                src={preview}
                alt="معاينة"
                className="w-24 h-24 object-cover rounded-xl mt-2"
              />
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#222] py-2 rounded-xl text-sm hover:bg-[#333] transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
