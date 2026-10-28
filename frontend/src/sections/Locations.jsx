// sections/Locations.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const [form, setForm] = useState({ title: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllLocations();
  }, [fetchAllLocations]);

  const handleAdd = async () => {
    if (!form.title.trim()) {
      toast.error(t("admin.locations.nameRequired"));
      return;
    }
    if (!form.price || form.price <= 0) {
      toast.error(t("admin.locations.priceRequired"));
      return;
    }
    setIsSubmitting(true);
    const result = await addLocation({
      title: form.title,
      price: parseFloat(form.price),
    });
    setIsSubmitting(false);
    if (result.success) setForm({ title: "", price: "" });
  };

  const handleEdit = (loc) => {
    setForm({ title: loc.title, price: loc.price });
    setEditingId(loc._id);
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      toast.error(t("admin.locations.nameRequired"));
      return;
    }
    if (!form.price || form.price <= 0) {
      toast.error(t("admin.locations.priceRequired"));
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

  const handleDelete = async (id, title) => {
    if (window.confirm(t("admin.locations.confirmDelete", { title }))) {
      await removeLocation(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", price: "" });
  };

  if (loading && locations.length === 0) {
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
      <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
        <div className="space-y-2">
          <label className="block text-sm text-muted">
            {t("admin.locations.zoneName")}
          </label>
          <input
            type="text"
            placeholder={t("admin.locations.zonePlaceholder")}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-muted">
            {t("admin.locations.price")}
          </label>
          <input
            type="number"
            placeholder={t("admin.locations.pricePlaceholder")}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 bg-background border border-border text-text placeholder:text-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? t("admin.locations.updating")
                  : t("admin.locations.update")}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 bg-border text-text py-2 rounded-xl text-sm hover:bg-muted/30 transition disabled:opacity-50"
              >
                {t("admin.locations.cancel")}
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50"
            >
              {isSubmitting
                ? t("admin.locations.adding")
                : t("admin.locations.add")}
            </button>
          )}
        </div>
      </div>

      {locations.length === 0 && !loading ? (
        <div className="bg-surface border border-border p-8 rounded-2xl text-center">
          <p className="text-muted">{t("admin.locations.empty")}</p>
          <p className="text-sm text-muted mt-2">
            {t("admin.locations.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center hover:bg-surface/80 transition"
            >
              <div>
                <p className="text-sm font-medium">{loc.title}</p>
                <p className="text-xs text-primary mt-1">
                  {loc.price} {t("menu.currency")}
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => handleEdit(loc)}
                  className="bg-border text-text px-3 py-1.5 rounded-lg hover:bg-muted/30 transition"
                >
                  {t("admin.locations.editBtn")}
                </button>
                <button
                  onClick={() => handleDelete(loc._id, loc.title)}
                  className="bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition"
                >
                  {t("admin.locations.deleteBtn")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
