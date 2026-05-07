// sections/AddProduct.jsx
import { useState } from "react";
import useFood from "../stores/food.store";

export default function AddProduct({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "pizza",
    discount: 0,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addFood } = useFood();

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const categories = [
    { value: "pizza", label: "Pizza", emoji: "🍕" },
    { value: "tacos", label: "Tacos", emoji: "🌮" },
    { value: "burger", label: "Burger", emoji: "🍔" },
    { value: "drink", label: "Drink", emoji: "🥤" },
  ];

  const handleImage = (file) => {
    if (!file) return;

    if (file.size > MAX_SIZE) {
      return setError("Image size must be less than 2MB");
    }

    if (!file.type.startsWith("image/")) {
      return setError("Please select a valid image file");
    }

    setError("");
    setForm({ ...form, image: file });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      setError("Product name is required");
      return;
    }

    if (!form.price || form.price <= 0) {
      setError("Valid price is required");
      return;
    }

    if (!form.image) {
      setError("Product image is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("discount", form.discount);
    formData.append("image", form.image);

    const result = await addFood(formData);

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setForm({
        title: "",
        price: "",
        category: "pizza",
        discount: 0,
        image: null,
      });
      setPreview(null);

      // Call success callback to switch tabs
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div className="bg-[#161616] rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm text-white/60 font-medium">
            Product Name
          </label>
          <input
            type="text"
            placeholder="e.g., Margherita Pizza"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm text-white/60 font-medium">
            Price (DZ)
          </label>
          <input
            type="number"
            placeholder="e.g., 1200"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm text-white/60 font-medium">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <label className="block text-sm text-white/60 font-medium">
            Discount (%)
          </label>
          <input
            type="number"
            placeholder="0 - 100"
            min="0"
            max="100"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: parseInt(e.target.value) || 0 })
            }
            className="w-full p-3 bg-[#111] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
          <p className="text-xs text-white/40">Leave 0 for no discount</p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm text-white/60 font-medium">
            Product Image (Max 2MB)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer transition"
            disabled={isSubmitting}
          />

          {/* Preview */}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl border-2 border-primary/50"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary py-3 rounded-xl text-sm font-semibold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
