import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faPhone,
  faLocationDot,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function Contact() {
  const socialLinks = [
    { icon: faFacebook, href: "#", name: "Facebook", color: "#1877f2" },
    { icon: faInstagram, href: "#", name: "Instagram", color: "#e4405f" },
    { icon: faWhatsapp, href: "#", name: "WhatsApp", color: "#25d366" },
  ];

  const workingHours = [
    { day: "السبت - الأربعاء", hours: "12:00 - 23:00" },
    { day: "الخميس", hours: "14:00 - 00:00" },
    { day: "الجمعة", hours: "مغلق" },
  ];

  return (
    <section id="contact" className="py-20 bg-[#0f0f0f] text-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl">تواصل معنا</h2>
        </div>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* RIGHT - Contact Info */}
          <div className="space-y-8 md:text-right">
            {/* Logo & Brand */}
            <div className="flex  items-center  gap-2 text-primary font-heading text-2xl">
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4 bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-heading border-r-2 border-primary pr-3">
                معلومات الاتصال
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href="tel:0550000000"
                  className="flex items-center gap-3 group hover:bg-white/5 p-3 rounded-xl transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-primary text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">اتصل بنا</p>
                    <p className="text-sm font-medium" dir="ltr">
                      +213 550 00 00 00
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-3 group hover:bg-white/5 p-3 rounded-xl transition-all duration-200">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-primary text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">موقعنا</p>
                    <p className="text-sm">الجزائر - حي النصر، شارع فلسطين</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 group hover:bg-white/5 p-3 rounded-xl transition-all duration-200">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">البريد الإلكتروني</p>
                    <p className="text-sm">chahiya@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-heading border-r-2 border-primary pr-3 mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-primary text-sm"
                />
                ساعات العمل
              </h3>
              <div className="space-y-3">
                {workingHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0"
                  >
                    <span className="text-sm">{item.day}</span>
                    <span
                      className={`text-sm ${
                        item.hours === "مغلق" ? "text-red-400" : "text-white/70"
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-heading border-r-2 border-primary pr-3 mb-4">
                تابعنا
              </h3>
              <div className="flex gap-4 md:justify-start">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
                    aria-label={social.name}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className="text-white/70 group-hover:text-primary transition text-lg"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* LEFT - Map */}
          <div className="space-y-4">
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-heading border-r-2 border-primary pr-3 mb-4">
                موقعنا على الخريطة
              </h3>
              <div className="w-full h-[280px] md:h-[400px] rounded-xl overflow-hidden border border-white/10">
                <iframe
                  title="Restaurant Location"
                  src="https://maps.google.com/maps?q=Algiers+Algeria&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🍕</div>
                <div>
                  <p className="text-sm font-medium">طلبك عندنا بأمان</p>
                  <p className="text-xs text-white/50">
                    توصيل سريع - جودة عالية - أسعار مناسبة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
