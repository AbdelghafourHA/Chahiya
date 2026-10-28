// client/src/utils/orderFormatter.js

const pad = (n) => String(n).padStart(2, "0");

// CH-20250128-1234
export const generateOrderNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CH-${datePart}-${random}`;
};

export const formatTime = (date = new Date()) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatDate = (date = new Date()) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

export const ORDER_TYPES = {
  delivery: { label: "توصيل", icon: "🚚", key: "delivery" },
  pickup: { label: "استلام", icon: "🏃", key: "pickup" },
  "dine-in": { label: "في المطعم", icon: "🍽️", key: "dine-in" },
};

export const buildWhatsAppMessage = ({
  orderNumber,
  orderType,
  customer,
  delivery,
  dineIn,
  pickup,
  items,
  subtotal,
  shipping,
  total,
  notes,
}) => {
  const lines = [];
  const typeInfo = ORDER_TYPES[orderType];
  const now = new Date();

  lines.push(`🍕 *طلب جديد - شهية*`);
  lines.push(`━━━━━━━━━━━━━━━━━━`);
  lines.push(`🆔 رقم الطلب: *${orderNumber}*`);
  lines.push(`📦 النوع: ${typeInfo.icon} ${typeInfo.label}`);
  lines.push(`🕒 الوقت: ${formatTime(now)} - ${formatDate(now)}`);

  if (orderType === "dine-in" && dineIn?.tableNumber) {
    lines.push(`🪑 رقم الطاولة: *${dineIn.tableNumber}*`);
  }
  if (orderType === "pickup" && pickup?.pickupTime) {
    lines.push(`⏱️ وقت الاستلام: *${pickup.pickupTime}*`);
  }

  lines.push(``);
  lines.push(`👤 *معلومات الزبون*`);
  lines.push(`الاسم: ${customer.fullName}`);

  if (customer.phone && customer.phone.trim()) {
    // Format the phone number with spaces (ex: 0771 04 50 98)
    const rawPhone = customer.phone.replace(/\D/g, "");
    const spacedPhone = rawPhone.replace(
      /(\d{4})(\d{2})(\d{2})(\d{2})/,
      "$1 $2 $3 $4"
    );

    // \u202D is the Left-to-Right Override (LRO) character.
    // It forces WhatsApp to render the numbers correctly.
    lines.push(`الهاتف: \u202D${spacedPhone}\u202C`);
  }

  if (orderType === "delivery") {
    lines.push(``);
    lines.push(`📍 *عنوان التوصيل*`);
    lines.push(`البلدية: ${delivery.zoneTitle}`);
    if (delivery.address) lines.push(`العنوان: ${delivery.address}`);
    if (delivery.mapsLink) {
      lines.push(`🗺️ الموقع الدقيق: ${delivery.mapsLink}`);
    }
  }

  lines.push(``);
  lines.push(`🛒 *الطلب*`);
  items.forEach((item) => {
    lines.push(
      `- ${item.title} × ${item.quantity} = ${item.price * item.quantity} دج`
    );
  });

  lines.push(``);
  lines.push(`💰 *الحساب*`);
  lines.push(`المجموع الفرعي: ${subtotal} دج`);
  if (orderType === "delivery") {
    lines.push(`التوصيل: ${shipping} دج`);
  }
  lines.push(`*الإجمالي: ${total} دج*`);

  if (notes && notes.trim()) {
    lines.push(``);
    lines.push(`📝 ملاحظات: ${notes.trim()}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━`);
  lines.push(`✅ الرجاء تأكيد الطلب بالرد على هذه الرسالة`);

  return lines.join("\n");
};

export const buildWhatsAppUrl = (phoneNumber, message) =>
  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
