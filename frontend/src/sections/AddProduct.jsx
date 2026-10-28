// sections/AddProduct.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useFood from "../stores/food.store";
import useCategory from "../stores/category.store";

export default function AddProduct({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    discount: 0,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addFood } = useFood();
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategory();
  const { t } = useTranslation();

  const MAX_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  useEffect(() => {
    if (!form.category && categories.length > 0) {
      setForm((prev) => ({ ...prev, category: categories[0].slug }));
    }
  }, [categories, form.category]);

  const handleImage = (file) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      return setError(t("admin.errors.imageSize"));
    }
    if (!file.type.startsWith("image/")) {
      return setError(t("admin.errors.imageType"));
    }
    setError("");
    setForm({ ...form, image: file });
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError(t("admin.errors.nameRequired"));
      return;
    }
    if (!form.price || form.price <= 0) {
      setError(t("admin.errors.priceRequired"));
      return;
    }
    if (!form.category) {
      setError(t("admin.errors.catRequired"));
      return;
    }
    if (!form.image) {
      setError(t("admin.errors.imageRequired", "Product image is required"));
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
      setForm({
        title: "",
        price: "",
        category: categories[0]?.slug || "",
        discount: 0,
        image: null,
      });
      setPreview(null);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t("admin.addProduct")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm text-muted font-medium">
            {t("admin.productName")}
          </label>
          <input
            type="text"
            placeholder={t("admin.productNamePlaceholder")}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm text-muted font-medium">
            {t("admin.priceDz")}
          </label>
          <input
            type="number"
            placeholder={t("admin.pricePlaceholder")}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm text-muted font-medium">
            {t("admin.category")}
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-3 bg-background border border-border text-text rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting || categoriesLoading}
          >
            {categories.length === 0 && (
              <option value="">{t("admin.noCategories")}</option>
            )}
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.emoji} {cat.name}
                {!cat.isActive ? ` ${t("admin.inactive")}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <label className="block text-sm text-muted font-medium">
            {t("admin.discountPercent")}
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
            className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted">{t("admin.discountHelp")}</p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm text-muted font-medium">
            {t("admin.productImage")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer transition text-muted"
            disabled={isSubmitting}
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl border-2 border-primary/50"
              />
            </div>
          )}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || categories.length === 0}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isSubmitting ? t("admin.addingProduct") : t("admin.addProductBtn")}
        </button>
      </form>
    </div>
  );
}
