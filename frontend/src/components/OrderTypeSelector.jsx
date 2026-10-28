// components/OrderTypeSelector.jsx
import { useTranslation } from "react-i18next";

export default function OrderTypeSelector({
  value,
  onChange,
  disabled = false,
}) {
  const { t } = useTranslation();

  const OPTIONS = [
    {
      key: "delivery",
      label: t("order.delivery"),
      icon: "🚚",
      desc: t("order.deliveryDesc"),
    },
    {
      key: "pickup",
      label: t("order.pickup"),
      icon: "🏃",
      desc: t("order.pickupDesc"),
    },
    {
      key: "dine-in",
      label: t("order.dineIn"),
      icon: "🍽️",
      desc: t("order.dineInDesc"),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => !disabled && onChange(opt.key)}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl border transition-all duration-200 ${
              active
                ? "bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/30"
                : "bg-surface border-border text-muted hover:border-primary/50 hover:text-text"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer active:scale-95"
            }`}
          >
            <span className="text-2xl md:text-3xl">{opt.icon}</span>
            <span className="text-xs md:text-sm font-semibold">
              {opt.label}
            </span>
            <span className="text-[10px] md:text-xs text-center leading-tight opacity-80">
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
