import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function Contact() {
  return (
    <section className="py-16 bg-[#0f0f0f] text-white">
      <div className="container max-w-5xl">
        {/* Title */}
        <h2 className="text-center font-heading text-2xl mb-10">تواصل معنا</h2>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* RIGHT (content) */}
          <div className="space-y-6  md:text-right ">
            {/* Logo */}
            <div className="flex  items-center  gap-2 text-primary font-heading text-xl">
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </div>

            {/* Phone */}
            <a
              href="tel:0550000000"
              className="flex  items-center  gap-2 text-sm hover:text-primary transition"
            >
              <FontAwesomeIcon icon={faPhone} />
              <span>0550 00 00 00</span>
            </a>

            {/* Location */}
            <div className="flex  items-center md:justify-start gap-2 text-sm text-white/70">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>ورقلة - حي النصر</span>
            </div>

            {/* Social Icons */}
            <div className="flex  md:justify-start gap-5 text-lg">
              <a href="#" className="hover:text-primary transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="hover:text-primary transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="hover:text-primary transition">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>

          {/* LEFT (map) */}
          <div className="w-full h-[260px] md:h-[320px] rounded-2xl overflow-hidden border border-border ">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Ouargla&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
