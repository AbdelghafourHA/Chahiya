import { useState } from "react";

const categories = [
  { id: "all", name: "الكل" },
  { id: "pizza", name: "بيتزا" },
  { id: "tacos", name: "تاكوس" },
  { id: "burger", name: "برغر" },
  { id: "drinks", name: "مشروبات" },
];

import pizza1 from "../assets/pizza1.jpg";
import pizza2 from "../assets/pizza2.jpg";
import tacos1 from "../assets/tacos1.jpg";
import burger1 from "../assets/burger1.jpg";
import burger2 from "../assets/burger2.jpg";
import drink1 from "../assets/cocacola.jpg";
import drink2 from "../assets/juice.jpg";

const items = [
  {
    id: 1,
    name: "بيتزا دجاج",
    price: 1200,
    category: "pizza",
    image: pizza1,
  },
  {
    id: 2,
    name: "بيتزا لحم",
    price: 1400,
    category: "pizza",
    image: pizza2,
  },
  {
    id: 3,
    name: "تاكوس دجاج",
    price: 900,
    category: "tacos",
    image: tacos1,
  },
  {
    id: 4,
    name: "تاكوس ميكس",
    price: 1100,
    category: "tacos",
    image: tacos1,
  },
  {
    id: 5,
    name: "برغر كلاسيك",
    price: 850,
    category: "burger",
    image: burger1,
  },
  {
    id: 6,
    name: "برغر دبل",
    price: 1200,
    category: "burger",
    image: burger2,
  },
  {
    id: 7,
    name: "عصير برتقال",
    price: 300,
    category: "drinks",
    image: drink2,
  },
  {
    id: 8,
    name: "كوكاكولا",
    price: 200,
    category: "drinks",
    image: drink1,
  },
];

export default function Menu() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? items : items.filter((item) => item.category === active);

  return (
    <section className="py-20 bg-black text-white">
      <div className="container">
        {/* Title */}
        <h2 className="text-center font-heading text-3xl md:text-4xl mb-12">
          اكتشف قائمتنا
        </h2>

        <div className="grid md:grid-cols-[200px_1fr] gap-10">
          {/* Sidebar */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`text-sm px-4 py-2 rounded-full whitespace-nowrap transition
                  ${
                    active === cat.id
                      ? "bg-secondary text-primary-foreground"
                      : "bg-white/10 text-white/60 hover:text-white"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-[50px] pt-12 pb-6 px-4 text-center "
              >
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h4 className="text-sm mb-1">{item.name}</h4>

                {/* Price */}
                <p className="font-heading text-lg text-primary">
                  {item.price} دج
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full hover:opacity-90 transition">
            عرض المزيد
          </button>
        </div>
      </div>
    </section>
  );
}
