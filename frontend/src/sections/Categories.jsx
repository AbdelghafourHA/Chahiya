// sections/Categories.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useCategory from "../stores/category.store";
import { toast } from "react-hot-toast";

const emptyForm = {
  name: "",
  slug: "",
  emoji: "",
  order: "",
  isActive: true,
};

export default function Categories() {
  const {
    categories,
    loading,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategory();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  const slugify = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const nextOrder = () => {
    if (categories.length === 0) return 0;
    return Math.max(...categories.map((c) => c.order || 0)) + 1;
  };

  const startEdit = (cat) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji || "",
      order: cat.order ?? 0,
      isActive: cat.isActive,
    });
    setEditingId(cat._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) {
      toast.error(t("admin.categories.nameRequired"));
      return;
    }
    const finalSlug = form.slug.trim() || slugify(form.name);
    if (!finalSlug) {
      toast.error(t("admin.categories.slugRequired"));
      return;
    }

    setIsSubmitting(true);
    const result = await addCategory({
      name: form.name.trim(),
      slug: finalSlug,
      emoji: form.emoji.trim() || "🍽️",
      order:
        form.order === "" || form.order === null
          ? nextOrder()
          : parseInt(form.order),
      isActive: form.isActive,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(t("admin.categories.addedSuccess"));
      setForm(emptyForm);
    } else {
      toast.error(result.message || t("admin.categories.addFail"));
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      toast.error(t("admin.categories.nameRequired"));
      return;
    }
    if (!form.slug.trim()) {
      toast.error(t("admin.categories.slugRequired"));
      return;
    }

    setIsSubmitting(true);
    const result = await editCategory(editingId, {
      name: form.name.trim(),
      slug: form.slug.trim(),
      emoji: form.emoji.trim() || "🍽️",
      order: parseInt(form.order) || 0,
      isActive: form.isActive,
    });
    setIsSubmitting(false);

    if (result.success) {
      if (result.cascade?.slugChanged && result.cascade.foodsUpdated > 0) {
        toast.success(
          t("admin.categories.updatedCascade", {
            count: result.cascade.foodsUpdated,
          })
        );
      } else {
        toast.success(t("admin.categories.updatedSuccess"));
      }
      cancelEdit();
    } else {
      toast.error(result.message || t("admin.categories.updateFail"));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(t("admin.categories.confirmDelete", { name }))) return;
    const result = await removeCategory(id);

    if (result.success) {
      toast.success(t("admin.categories.deletedSuccess"));
    } else if (result.foodCount !== undefined) {
      toast.error(
        t("admin.categories.deleteBlocked", { count: result.foodCount }),
        { duration: 5000 }
      );
    } else {
      toast.error(result.message || t("admin.categories.deleteFail"));
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-3 animate-pulse">
          <div className="h-10 bg-border rounded"></div>
          <div className="h-10 bg-border rounded"></div>
          <div className="h-10 bg-border rounded"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border p-4 rounded-xl animate-pulse"
            >
              <div className="h-5 bg-border rounded w-32 mb-2"></div>
              <div className="h-4 bg-border rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
        <h3 className="text-lg font-bold">
          {editingId
            ? t("admin.categories.editTitle")
            : t("admin.categories.addTitle")}
        </h3>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm text-muted">
              {t("admin.categories.name")}
            </label>
            <input
              type="text"
              placeholder={t("admin.categories.namePlaceholder")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-muted">
              {t("admin.categories.slug")}
            </label>
            <input
              type="text"
              placeholder={t("admin.categories.slugPlaceholder")}
              dir="ltr"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: slugify(e.target.value) })
              }
              className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted">
              {t("admin.categories.slugHelp")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[120px_120px_1fr] items-end">
          <div className="space-y-2">
            <label className="block text-sm text-muted">
              {t("admin.categories.emoji")}
            </label>
            <input
              type="text"
              placeholder="🍣"
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              className="w-full p-3 bg-background border border-border text-text text-center placeholder:text-muted rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
              maxLength={4}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-muted">
              {t("admin.categories.order")}
            </label>
            <input
              type="number"
              placeholder={nextOrder().toString()}
              min="0"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-muted">
              {t("admin.categories.status")}
            </label>
            <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer hover:bg-surface transition">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-4 h-4 accent-primary cursor-pointer"
                disabled={isSubmitting}
              />
              <span className="text-sm">
                {form.isActive
                  ? t("admin.categories.statusActive")
                  : t("admin.categories.statusInactive")}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? t("admin.categories.saving")
                  : t("admin.categories.saveChanges")}
              </button>
              <button
                onClick={cancelEdit}
                disabled={isSubmitting}
                className="flex-1 bg-border text-text py-2 rounded-xl text-sm hover:bg-muted/30 transition disabled:opacity-50"
              >
                {t("admin.categories.cancel")}
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
            >
              {isSubmitting
                ? t("admin.categories.adding")
                : t("admin.categories.addBtn")}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {categories.length === 0 && !loading ? (
        <div className="bg-surface border border-border p-8 rounded-2xl text-center">
          <p className="text-muted">{t("admin.categories.empty")}</p>
          <p className="text-sm text-muted mt-2">
            {t("admin.categories.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center gap-3 hover:bg-surface/80 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{cat.emoji}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">{cat.name}</p>
                    {!cat.isActive && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded shrink-0">
                        {t("admin.categories.inactiveBadge")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5" dir="ltr">
                    {cat.slug} · #{cat.order}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 text-xs shrink-0">
                <button
                  onClick={() => startEdit(cat)}
                  className="bg-border text-text px-3 py-1.5 rounded-lg hover:bg-muted/30 transition"
                >
                  {t("admin.categories.editBtn")}
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition"
                >
                  {t("admin.categories.deleteBtn")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
