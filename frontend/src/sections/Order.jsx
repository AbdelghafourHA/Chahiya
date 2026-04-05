import { useState } from "react";

const foods = [
  { _id: "1", name: "بيتزا دجاج", price: 1200, category: "pizza" },
  { _id: "2", name: "بيتزا لحم", price: 1400, category: "pizza" },
  { _id: "3", name: "تاكوس دجاج", price: 900, category: "tacos" },
  { _id: "4", name: "تاكوس ميكس", price: 1100, category: "tacos" },
  { _id: "5", name: "كوكاكولا", price: 200, category: "drinks" },
];

const places = [
  { _id: "1", name: "وسط المدينة", shippingPrice: 200 },
  { _id: "2", name: "حي النصر", shippingPrice: 300 },
];

export default function Order() {
  const [category, setCategory] = useState("pizza");
  const [cart, setCart] = useState([]);
  const [place, setPlace] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  const filtered = foods.filter((f) => f.category === category);

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === item._id);
      if (exist) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decrease = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const itemsPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const shipping = places.find((p) => p._id === place)?.shippingPrice || 0;

  const totalPrice = itemsPrice + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      customer: form,
      items: cart,
      shippingPlace: place,
      shippingPrice: shipping,
      totalPrice,
    };

    console.log(orderData);
  };

  return (
    <section className="py-16 bg-black text-white">
      <div className="container max-w-3xl">
        <h2 className="text-center font-heading text-2xl md:text-3xl mb-8">
          اطلب الآن
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inputs */}
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="p-3 text-sm rounded-xl bg-white/5 border border-border outline-none"
            />
            <input
              type="text"
              placeholder="رقم الهاتف"
              className="p-3 text-sm rounded-xl bg-white/5 border border-border outline-none"
            />
          </div>

          {/* Location */}
          <select
            onChange={(e) => setPlace(e.target.value)}
            className="w-full p-3 text-sm rounded-xl bg-white/5 border border-border"
          >
            <option value="">اختر الموقع</option>
            {places.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (+{p.shippingPrice} دج)
              </option>
            ))}
          </select>

          {/* Category */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["pizza", "tacos", "drinks"].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs md:text-sm px-3 py-1.5 rounded-full whitespace-nowrap
                  ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 text-white/60"
                  }`}
              >
                {cat === "pizza"
                  ? "بيتزا"
                  : cat === "tacos"
                  ? "تاكوس"
                  : "مشروبات"}
              </button>
            ))}
          </div>

          {/* Items (SMALL CHIPS ✅) */}
          <div className="flex flex-wrap gap-2">
            {filtered.map((item) => (
              <button
                type="button"
                key={item._id}
                onClick={() => addToCart(item)}
                className="text-xs md:text-sm px-3 py-2 rounded-full bg-white/5 border border-border hover:border-primary transition"
              >
                {item.name} - {item.price} دج
              </button>
            ))}
          </div>

          {/* Cart */}
          <div className="bg-white/5 p-4 rounded-2xl space-y-3">
            <h3 className="font-heading text-sm">الطلب</h3>

            {cart.length === 0 && (
              <p className="text-xs text-white/60">لم تضف أي شيء بعد</p>
            )}

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center text-sm"
              >
                <span>{item.name}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrease(item._id)}
                    className="w-6 h-6 bg-[#222] rounded-full text-xs"
                  >
                    -
                  </button>

                  <span className="text-xs">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 bg-primary rounded-full text-xs"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <hr className="border-border" />

            <div className="flex justify-between text-xs">
              <span>المجموع</span>
              <span>{itemsPrice} دج</span>
            </div>

            <div className="flex justify-between text-xs">
              <span>التوصيل</span>
              <span>{shipping} دج</span>
            </div>

            <div className="flex justify-between font-heading text-primary text-sm">
              <span>الإجمالي</span>
              <span>{totalPrice} دج</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-secondary text-secondary-foreground py-2.5 rounded-xl text-sm"
          >
            تأكيد الطلب
          </button>
        </form>
      </div>
    </section>
  );
}
