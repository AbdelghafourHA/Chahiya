import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBellConcierge } from "@fortawesome/free-solid-svg-icons";

import heroImg from "../assets/Hero.jpg";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col text-primary-foreground"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container flex-1 flex flex-col justify-center pt-32 pb-10">
        {/* Title */}
        <h1 className="text-center font-heading text-4xl md:text-6xl lg:text-7xl mb-14 leading-tight tracking-wide">
          فن الطعم الأصيل
        </h1>

        {/* Sections */}
        <div className="grid gap-10 md:grid-cols-2 mb-10 text-center">
          {/* About */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faUtensils}
              className="text-3xl mb-4 text-secondary"
            />
            <h3 className="font-heading text-xl mb-3">من نحن</h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed mb-5">
              نقدم تجربة طعام فريدة تمزج بين الجودة العالية والنكهات الأصيلة
              لنصنع لحظات لا تُنسى لكل زبون.
            </p>
            <a
              href="#contact"
              className="border border-primary-foreground/40 px-5 py-2 rounded-full text-sm hover:bg-primary-foreground hover:text-text transition"
            >
              تواصل معنا
            </a>
          </div>

          {/* Order */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faBellConcierge}
              className="text-3xl mb-4 text-secondary"
            />
            <h3 className="font-heading text-xl mb-3">اطلب الآن</h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed mb-5">
              اطلب وجبتك بسهولة واستمتع بسرعة التوصيل مع الحفاظ على جودة الطعام
              وطعمه المميز كما تحب.
            </p>
            <a
              href="#order"
              className="bg-secondary text-secondary-foreground px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
            >
              اطلب الآن
            </a>
          </div>
        </div>
      </div>

      {/* Stats (BOTTOM) */}
      <div className="relative z-10 border-t border-primary-foreground/20 py-6">
        <div className="container flex justify-between text-center">
          <div className="flex-1">
            <p className="text-3xl font-heading mb-1">08+</p>
            <p className="text-xs text-primary-foreground/60">فروع مميزة</p>
          </div>

          <div className="w-px bg-primary-foreground/20" />

          <div className="flex-1">
            <p className="text-3xl font-heading mb-1">40+</p>
            <p className="text-xs text-primary-foreground/60">طهاة محترفون</p>
          </div>

          <div className="w-px bg-primary-foreground/20" />

          <div className="flex-1">
            <p className="text-3xl font-heading mb-1">12+</p>
            <p className="text-xs text-primary-foreground/60">سنوات خبرة</p>
          </div>
        </div>
      </div>
    </section>
  );
}
