// components/OrderConfirmation.jsx
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OrderConfirmation({
  orderNumber,
  message,
  restaurantUrl,
  onReset,
}) {
  const ref = useRef(null);
  const { t } = useTranslation();
  const restaurantPhone = import.meta.env.VITE_RESTAURANT_PHONE || "";

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      ref={ref}
      className="bg-surface border border-border rounded-2xl p-6 md:p-8 max-w-2xl mx-auto space-y-5"
    >
      {/* Success header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/15 flex items-center justify-center text-3xl">
          ✅
        </div>
        <h3 className="font-heading text-xl md:text-2xl text-text">
          {t("order.confirmTitle", "تم تجهيز طلبك!")}
        </h3>
        <p className="text-sm text-muted">
          {t("order.orderNumber", "رقم الطلب:")}{" "}
          <span className="font-mono font-semibold text-primary">
            {orderNumber}
          </span>
        </p>
        <p className="text-xs text-muted">
          {t(
            "order.confirmDesc",
            "أرسل الرسالة في واتساب للمطعم — المطعم يتواصل مع السائق"
          )}
        </p>
      </div>

      {/* Primary action */}
      <a
        href={restaurantUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm md:text-base"
      >
        <span>📱</span>
        {t("order.reopenWa", "إعادة فتح واتساب")}
      </a>

      {/* Secondary */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {restaurantPhone && (
          <a
            href={`tel:${restaurantPhone}`}
            className="flex items-center justify-center gap-1 bg-secondary/15 text-secondary py-2 rounded-lg text-xs font-medium hover:bg-secondary/25 transition"
          >
            {t("order.callRestaurant", "📞 اتصل بالمطعم")}
          </a>
        )}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-1 bg-surface border border-border text-muted py-2 rounded-lg text-xs font-medium hover:text-text hover:bg-border transition"
        >
          {t("order.newOrder", "🔄 طلب جديد")}
        </button>
      </div>

      {/* Message preview (collapsible) */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted hover:text-text">
          {t("order.previewMsg", "معاينة الرسالة المُرسلة")}
        </summary>
        <pre className="mt-2 whitespace-pre-wrap bg-background border border-border rounded-xl p-3 text-text font-body max-h-72 overflow-auto">
          {message}
        </pre>
      </details>

      <p className="text-[11px] text-muted text-center">
        {t(
          "order.fallbackWa",
          "💡 إذا لم يفتح واتساب تلقائياً، اضغط الزر الأخضر أعلاه"
        )}
      </p>
    </div>
  );
}
