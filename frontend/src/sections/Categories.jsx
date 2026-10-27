// sections/Categories.jsx
import { useState, useEffect } from "react";
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

  // Load ALL categories (dashboard needs inactive ones too)
  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  /* -------------------------------------------------------------------- */
  /*                              Helpers                                 */
  /* -------------------------------------------------------------------- */

  const slugify = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Suggest next order value when adding a new one
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

  /* -------------------------------------------------------------------- */
  /*                              Submit                                  */
  /* -------------------------------------------------------------------- */

  const handleAdd = async () => {
    if (!form.name.trim()) {
      toast.error("اسم القسم مطلوب");
      return;
    }

    // If user didn't type a slug, try to auto-generate from name (works for Latin)
    const finalSlug = form.slug.trim() || slugify(form.name);

    if (!finalSlug) {
      toast.error("الرجاء إدخال الـ slug بالإنجليزية (مثال: sushi)");
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
      toast.success("تمت إضافة القسم");
      setForm(emptyForm);
    } else {
      toast.error(result.message || "فشلت الإضافة");
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      toast.error("اسم القسم مطلوب");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("الرجاء إدخال الـ slug بالإنجليزية");
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
      // If slug changed, backend cascaded to products — inform the user
      if (result.cascade?.slugChanged && result.cascade.foodsUpdated > 0) {
        toast.success(
          `تم التحديث — تم تحديث ${result.cascade.foodsUpdated} منتج تلقائياً`
        );
      } else {
        toast.success("تم التحديث");
      }
      cancelEdit();
    } else {
      toast.error(result.message || "فشل التحديث");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف قسم "${name}"؟`)) return;

    const result = await removeCategory(id);

    if (result.success) {
      toast.success("تم حذف القسم");
    } else if (result.foodCount !== undefined) {
      // Backend blocked the delete because products still use this category
      toast.error(
        `لا يمكن الحذف — يوجد ${result.foodCount} منتج في هذا القسم. حرّكها إلى قسم آخر أولاً.`,
        { duration: 5000 }
      );
    } else {
      toast.error(result.message || "فشل الحذف");
    }
  };

  /* -------------------------------------------------------------------- */
  /*                              Loading                                 */
  /* -------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------- */
  /*                              Render                                  */
  /* -------------------------------------------------------------------- */

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
        <h3 className="text-lg font-bold">
          {editingId ? "تعديل قسم" : "إضافة قسم جديد"}
        </h3>

        {/* Row: name + slug */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm text-muted">اسم القسم</label>
            <input
              type="text"
              placeholder="مثال: سوشي"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-muted">
              Slug (بالإنجليزية)
            </label>
            <input
              type="text"
              placeholder="مثال: sushi"
              dir="ltr"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: slugify(e.target.value) })
              }
              className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted">
              يُستخدم داخلياً فقط. عند تغييره، يتم تحديث جميع المنتجات تلقائياً.
            </p>
          </div>
        </div>

        {/* Row: emoji + order + active */}
        <div className="grid gap-3 md:grid-cols-[120px_120px_1fr] items-end">
          <div className="space-y-2">
            <label className="block text-sm text-muted">إيموجي</label>
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
            <label className="block text-sm text-muted">الترتيب</label>
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
            <label className="block text-sm text-muted">الحالة</label>
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
                {form.isActive ? "مفعّل (يظهر في الموقع)" : "معطّل (مخفي)"}
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
              >
                {isSubmitting ? "جاري التحديث..." : "حفظ التغييرات"}
              </button>
              <button
                onClick={cancelEdit}
                disabled={isSubmitting}
                className="flex-1 bg-border text-text py-2 rounded-xl text-sm hover:bg-muted/30 transition disabled:opacity-50"
              >
                إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة قسم"}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {categories.length === 0 && !loading ? (
        <div className="bg-surface border border-border p-8 rounded-2xl text-center">
          <p className="text-muted">لا توجد أقسام</p>
          <p className="text-sm text-muted mt-2">
            أضف قسمك الأول من خلال النموذج أعلاه
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
                        معطّل
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
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition"
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
