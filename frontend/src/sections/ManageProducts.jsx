// sections/ManageProducts.jsx
import { useState, useEffect } from "react";
import useFood from "../stores/food.store";
import EditProductModal from "./EditProductModal";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const {
    fetchAllFoods,
    removeFood,
    toggleAvailability,
    applyDiscountToCategory,
    applyDiscountToAll,
    removeDiscountFromCategory,
    removeDiscountFromAll,
  } = useFood();

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
  const [selectedCategory, setSelectedCategory] = useState("pizza");
  const [allDiscount, setAllDiscount] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const categories = [
    { value: "pizza", label: "بيتزا", emoji: "🍕" },
    { value: "tacos", label: "تاكوس", emoji: "🌮" },
    { value: "burger", label: "برغر", emoji: "🍔" },
    { value: "drink", label: "مشروبات", emoji: "🥤" },
  ];

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

  const handleDelete = async (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
      const result = await removeFood(id);
      if (result.success) {
        setFoods(foods.filter((f) => f._id !== id));
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    const result = await toggleAvailability(id);
    if (result.success) {
      setFoods(foods.map((f) => (f._id === id ? result.food : f)));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCategoryDiscount = async () => {
    if (!categoryDiscount || categoryDiscount < 0 || categoryDiscount > 100) {
      toast.error("الرجاء إدخال نسبة خصم صحيحة بين 0 و 100");
      return;
    }
    setIsApplyingDiscount(true);
    const result = await applyDiscountToCategory(
      selectedCategory,
      parseInt(categoryDiscount)
    );
    if (result.success) {
      setFoods(
        foods.map((food) => {
          const updated = result.foods.find((uf) => uf._id === food._id);
          return updated || food;
        })
      );
      setCategoryDiscount("");
    }
    setIsApplyingDiscount(false);
  };

  const handleRemoveCategoryDiscount = async () => {
    setIsApplyingDiscount(true);
    const result = await removeDiscountFromCategory(selectedCategory);
    if (result.success) {
      setFoods(
        foods.map((food) => {
          const updated = result.foods.find((uf) => uf._id === food._id);
          return updated || food;
        })
      );
    }
    setIsApplyingDiscount(false);
  };

  const handleAllDiscount = async () => {
    if (!allDiscount || allDiscount < 0 || allDiscount > 100) {
      toast.error("الرجاء إدخال نسبة خصم صحيحة بين 0 و 100");
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
    if (result.success) {
      setFoods(result.foods);
    }
    setIsApplyingDiscount(false);
  };

  if (loading && foods.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-[#161616] p-3 rounded-2xl flex items-center gap-3 animate-pulse"
          >
            <div className="w-14 h-14 rounded-xl bg-[#222]"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#222] rounded w-32"></div>
              <div className="h-3 bg-[#222] rounded w-20"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-8 bg-[#222] rounded"></div>
              <div className="w-16 h-8 bg-[#222] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (foods.length === 0 && !loading) {
    return (
      <div className="bg-[#161616] p-8 rounded-2xl text-center">
        <p className="text-white/60">لا توجد منتجات</p>
        <p className="text-sm text-white/40 mt-2">
          أضف منتجك الأول من تبويب "إضافة"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#161616] p-4 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold mb-3">إدارة الخصومات</h3>
        <div className="border-b border-white/10 pb-4">
          <p className="text-sm text-white/60 mb-3">خصم حسب القسم</p>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#111] px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="نسبة الخصم %"
              value={categoryDiscount}
              onChange={(e) => setCategoryDiscount(e.target.value)}
              className="bg-[#111] px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
              min="0"
              max="100"
            />
            <button
              onClick={handleCategoryDiscount}
              disabled={isApplyingDiscount || !categoryDiscount}
              className="bg-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition disabled:opacity-50"
            >
              تطبيق الخصم
            </button>
            <button
              onClick={handleRemoveCategoryDiscount}
              disabled={isApplyingDiscount}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition disabled:opacity-50"
            >
              إزالة الخصم
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/60 mb-3">خصم على جميع المنتجات</p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              placeholder="نسبة الخصم %"
              value={allDiscount}
              onChange={(e) => setAllDiscount(e.target.value)}
              className="bg-[#111] px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isApplyingDiscount}
              min="0"
              max="100"
            />
            <button
              onClick={handleAllDiscount}
              disabled={isApplyingDiscount || !allDiscount}
              className="bg-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition disabled:opacity-50"
            >
              تطبيق الخصم على الكل
            </button>
            <button
              onClick={handleRemoveAllDiscount}
              disabled={isApplyingDiscount}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition disabled:opacity-50"
            >
              إزالة الخصم من الكل
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {foods.map((product) => (
          <div
            key={product._id}
            className={`bg-[#161616] p-3 rounded-2xl flex items-center gap-3 transition ${
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
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                    غير متوفر
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    خصم {product.discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <p className="text-xs text-white/40 line-through">
                      {product.price} دج
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      {Math.floor(
                        product.price - (product.price * product.discount) / 100
                      )}{" "}
                      دج
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-primary">{product.price} دج</p>
                )}
                <p className="text-xs text-white/40">• {product.category}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => handleToggleAvailability(product._id)}
                className={`px-2 py-1 rounded transition ${
                  product.isAvailable
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
              >
                {product.isAvailable ? "تعطيل" : "تفعيل"}
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-[#222] px-2 py-1 rounded hover:bg-[#333] transition"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(product._id, product.title)}
                className="bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition"
              >
                حذف
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
            className="px-3 py-1 bg-[#161616] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222] transition"
          >
            السابق
          </button>
          <span className="px-3 py-1 bg-primary rounded-lg text-sm">
            {productsPagination.currentPage} / {productsPagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!productsPagination.hasNextPage}
            className="px-3 py-1 bg-[#161616] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222] transition"
          >
            التالي
          </button>
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
