import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Glass Container */}
      <div className="container mt-4">
        <div className="px-4 py-3 rounded-2xl border border-primary-foreground/20 bg-transparent backdrop-blur-md">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Links */}
            <div className="flex items-center gap-6 font-body text-primary-foreground">
              <a href="#" className="hover:text-secondary transition">
                الرئيسية
              </a>
              <a href="#" className="hover:text-secondary transition">
                قائمة الطعام
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2 font-heading text-xl text-primary">
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </div>

            {/* Right Links */}
            <div className="flex items-center gap-6 font-body text-primary-foreground">
              <a href="#" className="hover:text-secondary transition">
                أطلب الآن
              </a>
              <a href="#" className="hover:text-secondary transition">
                تواصل معنا
              </a>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col items-center gap-4 md:hidden text-primary-foreground">
            {/* Logo */}
            <div className="flex items-center gap-2 font-heading text-lg">
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </div>

            {/* Links */}
            <div className="w-full flex flex-wrap justify-between items-center gap-3 font-body text-xs">
              <a href="#" className="hover:text-secondary transition">
                الرئيسية
              </a>
              <a href="#" className="hover:text-secondary transition">
                قائمة الطعام
              </a>
              <a href="#" className="hover:text-secondary transition">
                أطلب الآن
              </a>
              <a href="#" className="hover:text-secondary transition">
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
