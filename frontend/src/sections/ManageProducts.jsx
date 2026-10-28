// sections/ManageProducts.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useFood from "../stores/food.store";
import useCategory from "../stores/category.store";
import EditProductModal from "../sections/EditProductModal";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const {
    fetchAllFoods,
    editFood,
    removeFood,
    toggleAvailability,
    applyDiscountToCategory,
    applyDiscountToAll,
    removeDiscountFromCategory,
    removeDiscountFromAll,
  } = useFood();

  const { categories, fetchCategories } = useCategory();
  const { t } = useTranslation();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPagination, setProductsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [categoryDiscount, setCategoryDiscount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allDiscount, setAllDiscount] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].slug);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result = await fetchAllFoods(currentPage, 10);
      if (result && result.success) {
        setFoods(result.foods);
        setProductsPagination(result.pagination);
      }
      setLoading(false);
    };
    loadProducts();
  }, [currentPage, fetchAllFoods]);

  const categoryLabel = (slug) => {
    if (!slug) return t("admin.manageProducts.noCategory");
    const cat = categories.find((c) => c.slug === slug);
    return cat ? `${cat.emoji} ${cat.name}` : slug;
  };

  const handleEditProduct = async (id, formData) => {
    const result = await editFood(id, formData);
    if (result && result.success) {
      setFoods(foods.map((food) => (food._id === id ? result.food : food)));
      toast.success("تم تحديث المنتج بنجاح");
    }
    return result;
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(t("admin.manageProducts.confirmDelete", { title }))) {
      const result = await removeFood(id);
      if (result.success) setFoods(foods.filter((f) => f._id !== id));
    }
  };

  const handleToggleAvailability = async (id) => {
    const result = await toggleAvailability(id);
    if (result.success) {
      setFoods(foods.map((f) => (f._id === id ? result.food : f)));
    }
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const handleCategoryDiscount = async () => {
    if (!selectedCategory) {
      toast.error(t("admin.manageProducts.selectCategoryError"));
      return;
    }
    if (!categoryDiscount || categoryDiscount < 0 || categoryDiscount > 100) {
      toast.error(t("admin.manageProducts.invalidDiscount"));
      return;
    }
    setIsApplyingDiscount(true);
    const result = await applyDiscountToCategory(
      selectedCategory,
      parseInt(categoryDiscount)
    );
    if (result.success) {
      setFoods(
        foods.map(
          (food) => result.foods.find((uf) => uf._id === food._id) || food
        )
      );
      setCategoryDiscount("");
    }
    setIsApplyingDiscount(false);
  };

  const handleRemoveCategoryDiscount = async () => {
    if (!selectedCategory) {
      toast.error(t("admin.manageProducts.selectCategoryError"));
      return;
    }
    setIsApplyingDiscount(true);
    const result = await removeDiscountFromCategory(selectedCategory);
    if (result.success) {
      setFoods(
        foods.map(
          (food) => result.foods.find((uf) => uf._id === food._id) || food
        )
      );
    }
    setIsApplyingDiscount(false);
  };

  const handleAllDiscount = async () => {
    if (!allDiscount || allDiscount < 0 || allDiscount > 100) {
      toast.error(t("admin.manageProducts.invalidDiscount"));
      return;
    }
    setIsApplyingDiscount(true);
    const result = await applyDiscountToAll(parseInt(allDiscount));
    if (result.success) {
      setFoods(result.foods);
      setAllDiscount("");
    }
    setIsApplyingDiscount(false);
  };

  const handleRemoveAllDiscount = async () => {
    setIsApplyingDiscount(true);
    const result = await removeDiscountFromAll();
    if (result.success) setFoods(result.foods);
    setIsApplyingDiscount(false);
  };

  if (loading && foods.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border p-3 rounded-2xl flex items-center gap-3 animate-pulse"
          >
            <div className="w-14 h-14 rounded-xl bg-border"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border rounded w-32"></div>
              <div className="h-3 bg-border rounded w-20"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-8 bg-border rounded"></div>
              <div className="w-16 h-8 bg-border rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (foods.length === 0 && !loading) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl text-center">
        <p className="text-muted">{t("admin.manageProducts.empty")}</p>
        <p className="text-sm text-muted mt-2">
          {t("admin.manageProducts.emptyDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-4 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold mb-3">
          {t("admin.manageProducts.discountTitle")}
        </h3>

        <div className="border-b border-border pb-4">
          <p className="text-sm text-muted mb-3">
            {t("admin.manageProducts.discountByCategory")}
          </p>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-background border border-border text-text px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
            >
              {categories.length === 0 && (
                <option value="">{t("admin.editModal.noCategories")}</option>
              )}
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.emoji} {cat.name}
                  {!cat.isActive ? ` ${t("admin.inactive")}` : ""}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder={t("admin.manageProducts.discountPercentPlaceholder")}
              value={categoryDiscount}
              onChange={(e) => setCategoryDiscount(e.target.value)}
              className="bg-background border border-border text-text placeholder:text-muted px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
              min="0"
              max="100"
            />
            <button
              onClick={handleCategoryDiscount}
              disabled={isApplyingDiscount || !categoryDiscount}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition disabled:opacity-50"
            >
              {t("admin.manageProducts.applyDiscount")}
            </button>
            <button
              onClick={handleRemoveCategoryDiscount}
              disabled={isApplyingDiscount}
              className="bg-red-500/20 text-red-500 dark:text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition disabled:opacity-50"
            >
              {t("admin.manageProducts.removeDiscount")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-3">
            {t("admin.manageProducts.discountAll")}
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              placeholder={t("admin.manageProducts.discountPercentPlaceholder")}
              value={allDiscount}
              onChange={(e) => setAllDiscount(e.target.value)}
              className="bg-background border border-border text-text placeholder:text-muted px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
              min="0"
              max="100"
            />
            <button
              onClick={handleAllDiscount}
              disabled={isApplyingDiscount || !allDiscount}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition disabled:opacity-50"
            >
              {t("admin.manageProducts.applyAll")}
            </button>
            <button
              onClick={handleRemoveAllDiscount}
              disabled={isApplyingDiscount}
              className="bg-red-500/20 text-red-500 dark:text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition disabled:opacity-50"
            >
              {t("admin.manageProducts.removeAll")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {foods.map((product) => (
          <div
            key={product._id}
            className={`bg-surface border border-border p-3 rounded-2xl flex items-center gap-3 transition ${
              !product.isAvailable ? "opacity-50" : ""
            }`}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{product.title}</p>
                {!product.isAvailable && (
                  <span className="text-xs bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-0.5 rounded">
                    {t("admin.manageProducts.outOfStock")}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                    {t("admin.manageProducts.discountBadge", {
                      percent: product.discount,
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <p className="text-xs text-muted line-through">
                      {product.price} {t("menu.currency")}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      {Math.floor(
                        product.price - (product.price * product.discount) / 100
                      )}{" "}
                      {t("menu.currency")}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-primary">
                    {product.price} {t("menu.currency")}
                  </p>
                )}
                <p className="text-xs text-muted">
                  • {categoryLabel(product.category)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => handleToggleAvailability(product._id)}
                className={`px-2 py-1 rounded transition ${
                  product.isAvailable
                    ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30"
                }`}
              >
                {product.isAvailable
                  ? t("admin.manageProducts.disable")
                  : t("admin.manageProducts.enable")}
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-border text-text px-2 py-1 rounded hover:bg-muted/30 transition"
              >
                {t("admin.manageProducts.edit")}
              </button>
              <button
                onClick={() => handleDelete(product._id, product.title)}
                className="bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition"
              >
                {t("admin.manageProducts.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {productsPagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!productsPagination.hasPrevPage}
            className="px-3 py-1 bg-surface border border-border text-text rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition"
          >
            {t("common.prev")}
          </button>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm">
            {productsPagination.currentPage} / {productsPagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!productsPagination.hasNextPage}
            className="px-3 py-1 bg-surface border border-border text-text rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition"
          >
            {t("common.next")}
          </button>
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
}
