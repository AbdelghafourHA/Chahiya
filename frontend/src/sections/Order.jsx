// sections/Order.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useFood from "../stores/food.store";
import useLocation from "../stores/locations.store";
import useCategory from "../stores/category.store";
import OrderTypeSelector from "../components/OrderTypeSelector";
import OrderConfirmation from "../components/OrderConfirmation";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  generateOrderNumber,
} from "../utils/orderFormatter";
import {
  isValidAlgerianPhone,
  formatPhone,
  isValidMapsLink,
  isLongEnough,
} from "../utils/validators";

/* -------------------------------------------------------------------------- */
/*                              Env config                                    */
/* -------------------------------------------------------------------------- */
const RESTAURANT_WHATSAPP =
  import.meta.env.VITE_RESTAURANT_WHATSAPP || "213551748269";
const PREP_TIME_MIN = parseInt(import.meta.env.VITE_ESTIMATED_PREP_TIME) || 30;

const CART_STORAGE_KEY = "chahiya_order_cart_v1";

const getFinalPrice = (item) =>
  item.discount > 0
    ? Math.floor(item.price - (item.price * item.discount) / 100)
    : item.price;

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */
export default function Order() {
  const sectionRef = useRef(null);
  const { t } = useTranslation();

  /* ------------------------- Store data -------------------------------- */
  const [category, setCategory] = useState("");
  const [foods, setFoods] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

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

  /* ------------------------- Cart (persisted) -------------------------- */
  const [cart, setCart] = useState([]);
  const [cartHydrated, setCartHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, cartHydrated]);

  /* ------------------------- Order form state -------------------------- */
  const [orderType, setOrderType] = useState("delivery");
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [selectedPlace, setSelectedPlace] = useState("");
  const [address, setAddress] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [pickupTime, setPickupTime] = useState(t("order.pickupAsap"));
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------- Confirmation ------------------------------ */
  const [confirmation, setConfirmation] = useState(null);

  /* ------------------------- Fetch data -------------------------------- */
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoadingData(true);
      const [foodResult] = await Promise.all([
        fetchAllFoods(1, 100),
        fetchAllLocations(),
        fetchCategories(true),
      ]);
      if (!cancelled && foodResult && foodResult.success) {
        setFoods(foodResult.foods.filter((f) => f.isAvailable === true));
      }
      if (!cancelled) setLoadingData(false);
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [fetchAllFoods, fetchAllLocations, fetchCategories]);

  useEffect(() => {
    if (!category && dynamicCategories.length > 0) {
      setCategory(dynamicCategories[0].slug);
    }
  }, [dynamicCategories, category]);

  /* ------------------------- Derived ----------------------------------- */
  const filteredFoods = useMemo(
    () => foods.filter((f) => f.category === category),
    [foods, category]
  );
  const itemsPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const selectedLocationData = locations.find((l) => l._id === selectedPlace);
  const shipping =
    orderType === "delivery" ? selectedLocationData?.price || 0 : 0;
  const totalPrice = itemsPrice + shipping;

  /* ------------------------- Cart ops ---------------------------------- */
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
  const decreaseQuantity = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  const removeItem = (id, title) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
    toast.success(`تم إزالة ${title}`);
  };
  const clearCart = () => setCart([]);

  /* ------------------------- Validation -------------------------------- */
  const validate = () => {
    const e = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3)
      e.fullName = t("order.errors.nameMin");

    if (orderType !== "dine-in") {
      if (!isValidAlgerianPhone(form.phone))
        e.phone = t("order.errors.phoneInvalid");
    }

    if (cart.length === 0) e.cart = t("order.errors.cartEmpty");

    if (orderType === "delivery") {
      if (!selectedPlace) e.selectedPlace = t("order.errors.zoneRequired");
      if (!isLongEnough(address, 5)) e.address = t("order.errors.addressMin");
      if (mapsLink && !isValidMapsLink(mapsLink))
        e.mapsLink = t("order.errors.mapsInvalid");
    }

    if (orderType === "dine-in" && !tableNumber.trim())
      e.tableNumber = t("order.errors.tableRequired");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ------------------------- Submit ------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(t("order.errors.fillRequired"));
      return;
    }

    setIsSubmitting(true);

    const orderNumber = generateOrderNumber();
    const message = buildWhatsAppMessage({
      orderNumber,
      orderType,
      customer: {
        fullName: form.fullName.trim(),
        phone: orderType === "dine-in" ? "" : formatPhone(form.phone),
      },
      delivery:
        orderType === "delivery"
          ? {
              zoneTitle: selectedLocationData?.title || "",
              address: address.trim(),
              mapsLink: mapsLink.trim(),
              shipping,
            }
          : null,
      dineIn:
        orderType === "dine-in" ? { tableNumber: tableNumber.trim() } : null,
      pickup: orderType === "pickup" ? { pickupTime } : null,
      items: cart,
      subtotal: itemsPrice,
      shipping,
      total: totalPrice,
      notes,
    });

    // ONE destination — restaurant only
    const restaurantUrl = buildWhatsAppUrl(RESTAURANT_WHATSAPP, message);

    try {
      window.open(restaurantUrl, "_blank", "noopener,noreferrer");
    } catch {
      /* blocked — user can click button */
    }

    setConfirmation({ orderNumber, message, restaurantUrl });
    setCart([]);
    setSelectedPlace("");
    setForm({ fullName: "", phone: "" });
    setAddress("");
    setMapsLink("");
    setTableNumber("");
    setNotes("");
    setErrors({});
    setIsSubmitting(false);
  };

  /* ------------------------- Reset ------------------------------------- */
  const handleReset = () => {
    setConfirmation(null);
    setOrderType("delivery");
    setPickupTime(t("order.pickupAsap"));
  };

  /* ------------------------- Loading skeleton --------------------------- */
  const isInitialLoading =
    (loadingData || locationsLoading || categoriesLoading) &&
    foods.length === 0 &&
    dynamicCategories.length === 0;

  if (isInitialLoading) {
    return (
      <section
        ref={sectionRef}
        id="order"
        className="py-20 bg-background text-text"
      >
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
            {t("order.title")}
          </h2>
          <div className="space-y-5 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 bg-surface rounded-2xl animate-pulse" />
              <div className="h-24 bg-surface rounded-2xl animate-pulse" />
              <div className="h-24 bg-surface rounded-2xl animate-pulse" />
            </div>
            <div className="h-12 bg-surface rounded-xl animate-pulse" />
            <div className="h-12 bg-surface rounded-xl animate-pulse" />
            <div className="h-32 bg-surface rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------- Render ------------------------------------ */
  return (
    <section
      ref={sectionRef}
      id="order"
      className="py-20 bg-background text-text transition-colors duration-300"
    >
      <div className="container max-w-3xl mx-auto px-4">
        <h2 className="text-center font-heading text-3xl md:text-4xl mb-8">
          {t("order.title")}
        </h2>

        {confirmation ? (
          <OrderConfirmation
            orderNumber={confirmation.orderNumber}
            message={confirmation.message}
            restaurantUrl={confirmation.restaurantUrl}
            onReset={handleReset}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            {/* STEP 1: Order type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                {t("order.step1")}
              </label>
              <OrderTypeSelector
                value={orderType}
                onChange={(v) => {
                  setOrderType(v);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.selectedPlace;
                    delete next.address;
                    delete next.mapsLink;
                    delete next.tableNumber;
                    delete next.phone;
                    return next;
                  });
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* STEP 2: Customer info */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                {t("order.step2")}
              </label>
              <div className="grid gap-3">
                <div>
                  <input
                    type="text"
                    placeholder={t("order.name")}
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className={`w-full p-3 text-sm rounded-xl bg-surface border text-text placeholder:text-muted outline-none focus:border-primary transition ${
                      errors.fullName ? "border-red-500" : "border-border"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {orderType !== "dine-in" && (
                  <div>
                    <input
                      type="tel"
                      placeholder={t("order.phone")}
                      value={formatPhone(form.phone)}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      className={`w-full p-3 text-sm rounded-xl bg-surface border text-text placeholder:text-muted outline-none focus:border-primary transition ${
                        errors.phone ? "border-red-500" : "border-border"
                      }`}
                      disabled={isSubmitting}
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* STEP 3a: Delivery */}
            {orderType === "delivery" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  {t("order.step3Delivery")}
                </label>
                <div className="grid gap-3">
                  <div>
                    <select
                      value={selectedPlace}
                      onChange={(e) => setSelectedPlace(e.target.value)}
                      className={`w-full p-3 text-sm rounded-xl bg-surface border text-text outline-none focus:border-primary transition ${
                        errors.selectedPlace
                          ? "border-red-500"
                          : "border-border"
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">{t("order.zone")}</option>
                      {locations.map((loc) => (
                        <option key={loc._id} value={loc._id}>
                          {loc.title} (+{loc.price} {t("menu.currency")})
                        </option>
                      ))}
                    </select>
                    {errors.selectedPlace && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.selectedPlace}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder={t("order.address")}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-3 text-sm rounded-xl bg-surface border text-text placeholder:text-muted outline-none focus:border-primary transition resize-none ${
                        errors.address ? "border-red-500" : "border-border"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-muted">
                        {t("order.mapsLink")}
                      </label>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {t("order.openMaps")}
                      </a>
                    </div>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={mapsLink}
                      onChange={(e) => setMapsLink(e.target.value)}
                      className={`w-full p-3 text-sm rounded-xl bg-surface border text-text placeholder:text-muted outline-none focus:border-primary transition ${
                        errors.mapsLink ? "border-red-500" : "border-border"
                      }`}
                      disabled={isSubmitting}
                      dir="ltr"
                    />
                    {errors.mapsLink && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mapsLink}
                      </p>
                    )}
                    <p className="text-[11px] text-muted mt-1 leading-relaxed">
                      {t("order.mapsHelp")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3b: Dine-in */}
            {orderType === "dine-in" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  {t("order.step3DineIn")}
                </label>
                <input
                  type="text"
                  placeholder={t("order.tableNumber")}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className={`w-full p-3 text-sm rounded-xl bg-surface border text-text placeholder:text-muted outline-none focus:border-primary transition ${
                    errors.tableNumber ? "border-red-500" : "border-border"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.tableNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tableNumber}
                  </p>
                )}
                <p className="text-[11px] text-muted">{t("order.tableHelp")}</p>
              </div>
            )}

            {/* STEP 3c: Pickup */}
            {orderType === "pickup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  {t("order.step3Pickup")}
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl bg-surface border border-border text-text outline-none focus:border-primary transition"
                  disabled={isSubmitting}
                >
                  <option value={t("order.pickupAsap")}>
                    {t("order.pickupAsap")} (~{PREP_TIME_MIN}{" "}
                    {t("common.mins", "دقيقة")})
                  </option>
                  <option value={t("order.pickup30")}>
                    {t("order.pickup30")}
                  </option>
                  <option value={t("order.pickup1h")}>
                    {t("order.pickup1h")}
                  </option>
                  <option value={t("order.pickup2h")}>
                    {t("order.pickup2h")}
                  </option>
                </select>
              </div>
            )}

            {/* STEP 4: Menu */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                {t("order.step4")}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {dynamicCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => setCategory(cat.slug)}
                    className={`text-xs md:text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
                      category === cat.slug
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-surface text-muted border-border hover:bg-border hover:text-text"
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>

              {filteredFoods.length === 0 ? (
                <div className="text-center py-6 text-muted text-sm">
                  {t("menu.empty")}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredFoods.map((item) => {
                    const finalPrice = getFinalPrice(item);
                    return (
                      <button
                        type="button"
                        key={item._id}
                        onClick={() => addToCart(item)}
                        className="text-xs md:text-sm px-3 py-2 rounded-full bg-surface border border-border text-text hover:border-primary transition active:scale-95"
                        disabled={isSubmitting}
                      >
                        {item.title} —{" "}
                        {item.discount > 0 ? (
                          <>
                            <span className="line-through text-muted mx-1">
                              {item.price}
                            </span>
                            <span className="text-primary">{finalPrice}</span>
                          </>
                        ) : (
                          <span className="mx-1">{item.price}</span>
                        )}
                        {t("menu.currency")}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 5: Cart */}
            <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold">
                  {t("order.step5")}
                </h3>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:underline"
                  >
                    {t("order.clearCart")}
                  </button>
                )}
              </div>

              {cart.length === 0 && (
                <p className="text-xs text-muted">{t("order.emptyCart")}</p>
              )}

              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="truncate flex-1">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id)}
                        className="w-6 h-6 bg-border text-text rounded-full text-xs hover:bg-muted/40 transition active:scale-90"
                        disabled={isSubmitting}
                      >
                        -
                      </button>
                      <span className="text-xs w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs hover:bg-primary/80 transition active:scale-90"
                        disabled={isSubmitting}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item._id, item.title)}
                        className="text-red-500 dark:text-red-400 text-xs hover:text-red-600 dark:hover:text-red-300 transition w-6"
                        disabled={isSubmitting}
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.cart && (
                <p className="text-red-500 text-xs">{errors.cart}</p>
              )}

              {cart.length > 0 && (
                <div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-xs mt-3">
                    <span>{t("order.subtotal")}</span>
                    <span>
                      {itemsPrice} {t("menu.currency")}
                    </span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between text-xs mt-2">
                      <span>{t("order.shipping")}</span>
                      <span>
                        {shipping} {t("menu.currency")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-heading text-primary text-sm pt-2 mt-2 border-t border-border">
                    <span>{t("order.total")}</span>
                    <span>
                      {totalPrice} {t("menu.currency")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 6: Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                {t("order.step6")}
              </label>
              <textarea
                rows={2}
                placeholder={t("order.notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-sm rounded-xl bg-surface border border-border text-text placeholder:text-muted outline-none focus:border-primary transition resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("order.submitting") : t("order.submit")}
            </button>

            <p className="text-[11px] text-muted text-center">
              {t("order.waHelp")}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
