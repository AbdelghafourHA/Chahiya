// sections/Menu.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFood from "../stores/food.store";
import useCategory from "../stores/category.store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* -------------------------------------------------------------------------- */
/*                        Inline skeletons (RTL aware)                        */
/* -------------------------------------------------------------------------- */

/** Category pill skeleton — same shape as the real pills */
function CategorySkeleton({ count = 5 }) {
  return (
    <div className="flex md:flex-col gap-3 flex-wrap max-md:justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-9 w-24 rounded-full bg-surface border border-border animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

/** Food card skeleton — same shape as the real cards */
function FoodCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-[50px] pt-12 pb-6 px-4 text-center animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-border" />
          <div className="h-4 bg-border rounded w-24 mx-auto mb-2" />
          <div className="h-5 bg-border rounded w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Menu                                    */
/* -------------------------------------------------------------------------- */

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

  const {
    loading: foodsLoading,
    fetchAllFoods,
    fetchFoodsByCategory,
  } = useFood();
  const { categories: dynamicCategories, fetchCategories } = useCategory();

  const itemsPerPage = 6;

  // Load categories ONCE at mount
  const categoriesFetchedRef = useRef(false);
  useEffect(() => {
    if (categoriesFetchedRef.current) return;
    categoriesFetchedRef.current = true;
    fetchCategories(true);
  }, [fetchCategories]);

  // Load foods on tab or page change
  useEffect(() => {
    let cancelled = false;
    const loadFoods = async () => {
      let result;
      if (active === "all") {
        result = await fetchAllFoods(currentPage, itemsPerPage);
      } else {
        result = await fetchFoodsByCategory(active, currentPage, itemsPerPage);
      }

      if (!cancelled && result && result.success) {
        setFoods(result.foods);
        setMenuPagination(result.pagination);
      }
    };
    loadFoods();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, currentPage]);

  const handleCategoryChange = (categoryId) => {
    setActive(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayFoods =
    active === "all"
      ? foods
      : foods.filter(
          (food) => food.category === active && food.isAvailable === true
        );

  // Tabs: "الكل" + dynamic categories
  const tabs = [
    { id: "all", name: "الكل", emoji: "📋" },
    ...dynamicCategories.map((c) => ({
      id: c.slug,
      name: c.name,
      emoji: c.emoji,
    })),
  ];

  // Full-screen skeleton ONLY on first-ever load (categories not yet in store)
  const isFirstLoad = dynamicCategories.length === 0 && foodsLoading;

  if (isFirstLoad) {
    return (
      <section id="menu" dir="rtl" className="py-20 bg-background text-text">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
            اكتشف قائمتنا
          </h2>
          <div className="grid md:grid-cols-[200px_1fr] gap-10">
            <CategorySkeleton />
            <FoodCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      dir="rtl"
      id="menu"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-20 bg-background text-text transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="text-center font-heading text-3xl md:text-4xl mb-12"
        >
          اكتشف قائمتنا
        </motion.h2>

        <div className="grid md:grid-cols-[200px_1fr] gap-10">
          {/* Categories Sidebar */}
          <motion.div
            variants={containerVariants}
            className="flex md:flex-col gap-3 flex-wrap max-md:justify-center pb-2"
          >
            {tabs.map((cat) => (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                  active === cat.id
                    ? "bg-secondary/20 border-secondary text-text font-medium"
                    : "bg-surface border-border text-muted hover:text-text hover:border-secondary/50"
                }`}
              >
                <span className="ml-1">{cat.emoji}</span>
                {cat.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Food Items Grid */}
          <motion.div variants={containerVariants}>
            {/* Only the product area shows a loading state on tab change */}
            {foodsLoading ? (
              <FoodCardSkeleton />
            ) : displayFoods.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center py-12">
                <p className="text-muted">لا توجد منتجات في هذا القسم</p>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active + currentPage}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    {displayFoods.map((item) => (
                      <motion.div
                        key={item._id}
                        variants={cardVariants}
                        whileHover={{ y: -5 }}
                        className={`bg-surface border border-border rounded-[50px] pt-12 pb-6 px-4 text-center transition-all duration-300 group relative ${
                          !item.isAvailable && active === "all"
                            ? "opacity-60 grayscale"
                            : "hover:bg-surface/80 hover:border-secondary/40 hover:shadow-xl"
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                          className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden border border-border group-hover:border-primary transition"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h4 className="text-sm mb-1 font-medium text-text">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          {item.discount > 0 ? (
                            <>
                              <p className="text-xs text-muted line-through">
                                {item.price} دج
                              </p>
                              <motion.p
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="font-heading text-lg text-primary"
                              >
                                {Math.floor(
                                  item.price -
                                    (item.price * item.discount) / 100
                                )}{" "}
                                دج
                              </motion.p>
                            </>
                          ) : (
                            <p className="font-heading text-lg text-primary">
                              {item.price} دج
                            </p>
                          )}
                        </div>
                        {item.discount > 0 && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              duration: 0.4,
                              type: "spring",
                              stiffness: 200,
                            }}
                            dir="ltr"
                            className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {item.discount}% OFF
                          </motion.div>
                        )}
                        {!item.isAvailable && active === "all" && (
                          <div className="absolute inset-0 bg-black/60 rounded-[50px] flex items-center justify-center">
                            <span className="bg-red-500/90 text-white text-sm px-4 py-2 rounded-full font-bold">
                              غير متوفر
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {menuPagination.totalPages > 1 && (
                  <motion.div
                    variants={paginationVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex justify-center gap-3 mt-12"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!menuPagination.hasPrevPage}
                      className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-text hover:bg-border transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                              className={`w-10 h-10 rounded-full text-sm transition border ${
                                currentPage === pageNum
                                  ? "bg-secondary text-secondary-foreground border-secondary"
                                  : "bg-surface border-border text-text hover:bg-border"
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
                      className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-text hover:bg-border transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
