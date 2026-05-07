// sections/Menu.jsx
import { useState, useEffect } from "react";
import useFood from "../stores/food.store";

const categories = [
  { id: "all", name: "الكل" },
  { id: "pizza", name: "بيتزا" },
  { id: "tacos", name: "تاكوس" },
  { id: "burger", name: "برغر" },
  { id: "drink", name: "مشروبات" },
];

export default function Menu() {
  const [active, setActive] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [foods, setFoods] = useState([]);
  const [menuPagination, setMenuPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { loading, fetchAllFoods, fetchFoodsByCategory } = useFood();
  const itemsPerPage = 6;

  useEffect(() => {
    const loadFoods = async () => {
      let result;
      if (active === "all") {
        result = await fetchAllFoods(currentPage, itemsPerPage);
      } else {
        result = await fetchFoodsByCategory(active, currentPage, itemsPerPage);
      }

      if (result && result.success) {
        setFoods(result.foods);
        setMenuPagination(result.pagination);
      }
    };
    loadFoods();
  }, [active, currentPage]);

  const handleCategoryChange = (categoryId) => {
    setActive(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && foods.length === 0) {
    return (
      <section id="menu" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
            اكتشف قائمتنا
          </h2>
          <div className="grid md:grid-cols-[200px_1fr] gap-10">
            <div className="flex md:flex-col gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="h-10 w-24 bg-white/10 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-[50px] pt-12 pb-6 px-4 text-center animate-pulse"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-white/10"></div>
                  <div className="h-4 bg-white/10 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-5 bg-white/10 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
          اكتشف قائمتنا
        </h2>

        <div className="grid md:grid-cols-[200px_1fr] gap-10">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-sm px-4 py-2 rounded-full whitespace-nowrap transition ${
                  active === cat.id
                    ? "bg-secondary text-primary-foreground"
                    : "bg-white/10 text-white/60 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div>
            {foods.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-white/60">لا توجد منتجات في هذا القسم</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {foods.map((item) => (
                    <div
                      key={item._id}
                      className={`bg-white/5 border border-white/10 rounded-[50px] pt-12 pb-6 px-4 text-center transition group relative ${
                        !item.isAvailable
                          ? "opacity-60 grayscale"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/10 group-hover:border-primary transition">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-sm mb-1 font-medium">{item.title}</h4>
                      <div className="flex items-center justify-center gap-2">
                        {item.discount > 0 ? (
                          <>
                            <p className="text-xs text-white/40 line-through">
                              {item.price} دج
                            </p>
                            <p className="font-heading text-lg text-primary">
                              {Math.floor(
                                item.price - (item.price * item.discount) / 100
                              )}{" "}
                              دج
                            </p>
                          </>
                        ) : (
                          <p className="font-heading text-lg text-primary">
                            {item.price} دج
                          </p>
                        )}
                      </div>

                      {/* Discount Badge */}
                      {item.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.discount}% OFF
                        </div>
                      )}

                      {/* Unavailable Badge */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 rounded-[50px] flex items-center justify-center">
                          <span className="bg-red-500/90 text-white text-sm px-4 py-2 rounded-full font-bold">
                            غير متوفر
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {menuPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-3 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!menuPagination.hasPrevPage}
                      className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.min(5, menuPagination.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (menuPagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (
                            currentPage >=
                            menuPagination.totalPages - 2
                          ) {
                            pageNum = menuPagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full text-sm transition ${
                                currentPage === pageNum
                                  ? "bg-secondary text-primary-foreground"
                                  : "bg-white/10 hover:bg-white/20"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!menuPagination.hasNextPage}
                      className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
