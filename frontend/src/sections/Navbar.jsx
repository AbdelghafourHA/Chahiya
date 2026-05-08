import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade up animation for navbar items
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed top-0 left-0 w-full z-50"
    >
      {/* Glass Container */}
      <div className="container mt-4">
        <motion.div
          variants={containerVariants}
          className={`px-4 py-3 rounded-2xl border border-primary-foreground/20 bg-transparent backdrop-blur-md transition-all duration-300 ${
            scrolled ? "bg-black/20 shadow-lg" : ""
          }`}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Links */}
            <div className="flex items-center gap-6 font-body text-primary-foreground">
              <motion.a
                href="#hero"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hover:text-secondary transition cursor-pointer"
              >
                الرئيسية
              </motion.a>
              <motion.a
                href="#menu"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hover:text-secondary transition cursor-pointer"
              >
                قائمة الطعام
              </motion.a>
            </div>

            {/* Logo */}
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 font-heading text-xl text-primary cursor-pointer"
            >
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </motion.div>

            {/* Right Links */}
            <div className="flex items-center gap-6 font-body text-primary-foreground">
              <motion.a
                href="#order"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="hover:text-secondary transition cursor-pointer"
              >
                أطلب الآن
              </motion.a>
              <motion.a
                href="#contact"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="hover:text-secondary transition cursor-pointer"
              >
                تواصل معنا
              </motion.a>
            </div>
          </div>

          {/* Mobile Layout */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center gap-4 md:hidden text-primary-foreground"
          >
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 font-heading text-lg"
            >
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </motion.div>

            {/* Links */}
            <div className="w-full flex flex-wrap justify-between items-center gap-3 font-body text-xs">
              {["الرئيسية", "قائمة الطعام", "أطلب الآن", "تواصل معنا"].map(
                (item, index) => (
                  <motion.a
                    key={item}
                    href={`#${
                      item === "الرئيسية"
                        ? "hero"
                        : item === "قائمة الطعام"
                        ? "menu"
                        : item === "أطلب الآن"
                        ? "order"
                        : "contact"
                    }`}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="hover:text-secondary transition cursor-pointer"
                  >
                    {item}
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
