// sections/Order.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import useFood from "../stores/food.store";
import useLocation from "../stores/locations.store";
import useCategory from "../stores/category.store";

// 👇 Change this to the restaurant's WhatsApp number (international format, no +)
const WHATSAPP_NUMBER = "213698055344";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const cartItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const getFinalPrice = (item) => {
  if (item.discount > 0) {
    return Math.floor(item.price - (item.price * item.discount) / 100);
  }
  return item.price;
};

export default function Order() {
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchAllFoods } = useFood();
  const {
    locations,
    loading: locationsLoading,
    fetchAllLocations,
  } = useLocation();
  const {
    categories: dynamicCategories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategory();

  // Load categories, foods, and locations together
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [foodResult] = await Promise.all([
        fetchAllFoods(1, 100),
        fetchAllLocations(),
        fetchCategories(true),
      ]);
      if (foodResult && foodResult.success) {
        const availableFoods = foodResult.foods.filter(
          (f) => f.isAvailable === true
        );
        setFoods(availableFoods);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchAllFoods, fetchAllLocations, fetchCategories]);

  // Once categories arrive, default to the first one
  useEffect(() => {
    if (!category && dynamicCategories.length > 0) {
      setCategory(dynamicCategories[0].slug);
    }
  }, [dynamicCategories, category]);

  const filteredFoods = foods.filter((f) => f.category === category);

  const addToCart = (item) => {
    const finalPrice = getFinalPrice(item);
    setCart((prev) => {
      const exist = prev.find((i) => i._id === item._id);
      if (exist) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, price: finalPrice, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id, title) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
    toast.success(`تم إزالة ${title} من السلة`);
  };

  const itemsPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const selectedLocationData = locations.find((l) => l._id === selectedPlace);
  const shipping = selectedLocationData?.price || 0;
  const totalPrice = itemsPrice + shipping;

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("🍕 *طلب جديد*");
    lines.push("");
    lines.push(`👤 الاسم: ${form.fullName}`);
    lines.push(`📞 الهاتف: ${form.phone}`);
    lines.push(`📍 الموقع: ${selectedLocationData?.title || ""}`);
    lines.push("");
    lines.push("📋 *الطلب:*");
    cart.forEach((item) => {
      lines.push(
        `- ${item.title} × ${item.quantity} = ${item.price * item.quantity} دج`
      );
    });
    lines.push("");
    lines.push(`المجموع الفرعي: ${itemsPrice} دج`);
    lines.push(`التوصيل: ${shipping} دج`);
    lines.push(`*الإجمالي: ${totalPrice} دج*`);
    return lines.join("\n");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("الرجاء إدخال الاسم الكامل");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }
    if (cart.length === 0) {
      toast.error("الرجاء إضافة أطباق إلى السلة");
      return;
    }
    if (!selectedPlace) {
      toast.error("الرجاء اختيار موقع التوصيل");
      return;
    }

    setIsSubmitting(true);

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    toast.success("تم فتح واتساب، أرسل الطلب الآن");

    setCart([]);
    setSelectedPlace("");
    setForm({ fullName: "", phone: "" });
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || locationsLoading || categoriesLoading) {
    return (
      <section id="order" className="py-20 bg-background text-text">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
            اطلب الآن
          </h2>
          <div className="space-y-5 max-w-2xl mx-auto">
            <div className="h-12 bg-surface rounded-xl animate-pulse"></div>
            <div className="h-12 bg-surface rounded-xl animate-pulse"></div>
            <div className="h-12 bg-surface rounded-xl animate-pulse"></div>
            <div className="h-32 bg-surface rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      dir="rtl"
      id="order"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-20 bg-background text-text transition-colors duration-300"
    >
      <div className="container max-w-3xl mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="text-center font-heading text-3xl md:text-4xl mb-12"
        >
          اطلب الآن
        </motion.h2>

        <motion.form
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="space-y-5 max-w-2xl mx-auto"
        >
          {/* Customer Information */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="p-3 text-sm rounded-xl bg-surface border border-border text-text placeholder:text-muted outline-none focus:border-primary transition"
              disabled={isSubmitting}
              required
            />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-3 text-sm rounded-xl bg-surface border border-border text-text placeholder:text-muted outline-none focus:border-primary transition"
              disabled={isSubmitting}
              required
            />
          </motion.div>

          {/* Location Selection */}
          <motion.div variants={itemVariants}>
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="w-full p-3 text-sm rounded-xl bg-surface border border-border text-text outline-none focus:border-primary transition"
              disabled={isSubmitting}
              required
            >
              <option value="">اختر موقع التوصيل</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.title} (+{loc.price} دج)
                </option>
              ))}
            </select>
          </motion.div>

          {/* Categories — dynamic */}
          <motion.div
            variants={itemVariants}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {dynamicCategories.map((cat) => (
              <motion.button
                type="button"
                key={cat._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.slug)}
                className={`text-xs md:text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
                  category === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-muted border-border hover:bg-border hover:text-text"
                }`}
              >
                {cat.emoji} {cat.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Food Items */}
          <motion.div variants={itemVariants}>
            {filteredFoods.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>لا توجد أطباق متاحة في هذا القسم حالياً</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredFoods.map((item) => {
                  const finalPrice = getFinalPrice(item);
                  return (
                    <motion.button
                      type="button"
                      key={item._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item)}
                      className="text-xs md:text-sm px-3 py-2 rounded-full bg-surface border border-border text-text hover:border-primary transition"
                      disabled={isSubmitting}
                    >
                      {item.title} -{" "}
                      {item.discount > 0 ? (
                        <>
                          <span className="line-through text-muted mx-1">
                            {item.price}
                          </span>
                          <span className="text-primary">{finalPrice}</span>
                        </>
                      ) : (
                        <span className="mr-1">{item.price}</span>
                      )}{" "}
                      دج
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Shopping Cart */}
          <motion.div
            variants={itemVariants}
            className="bg-surface border border-border p-4 rounded-2xl space-y-3"
          >
            <h3 className="font-heading text-sm">سلة الطلب</h3>

            {cart.length === 0 && (
              <p className="text-xs text-muted">لم تضف أي شيء بعد</p>
            )}

            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  variants={cartItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex justify-between items-center text-sm"
                >
                  <span className="truncate flex-1">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decreaseQuantity(item._id)}
                      className="w-6 h-6 bg-border text-text rounded-full text-xs hover:bg-muted/40 transition"
                      disabled={isSubmitting}
                    >
                      -
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs w-6 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs hover:bg-primary/80 transition"
                      disabled={isSubmitting}
                    >
                      +
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item._id, item.title)}
                      className="text-red-500 dark:text-red-400 text-xs hover:text-red-600 dark:hover:text-red-300 transition w-6"
                    >
                      ✕
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <hr className="border-border" />
                <div className="flex justify-between text-xs mt-3">
                  <span>مجموع الأطباق</span>
                  <span>{itemsPrice} دج</span>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span>سعر التوصيل</span>
                  <span>{shipping} دج</span>
                </div>
                <div className="flex justify-between font-heading text-primary text-sm pt-2 mt-2 border-t border-border">
                  <span>الإجمالي</span>
                  <span>{totalPrice} دج</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-secondary text-secondary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري التحويل..." : "تأكيد الطلب"}
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
}
