import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
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
      <div className="container mt-4">
        <motion.div
          variants={containerVariants}
          className={`px-4 py-3 rounded-2xl border border-border bg-background/70 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "bg-background/90 shadow-lg" : ""
          }`}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Links */}
            <div className="flex items-center gap-6 font-body text-text">
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

            {/* Right Links + Toggle */}
            <div className="flex items-center gap-6 font-body text-text">
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

              <motion.div variants={itemVariants}>
                <ThemeToggle />
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center gap-4 md:hidden text-text"
          >
            {/* Logo + Toggle row */}
            <div className="w-full flex items-center justify-between">
              <motion.div
                variants={logoVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 font-heading text-lg text-primary"
              >
                <FontAwesomeIcon icon={faBurger} />
                <span>شهية</span>
              </motion.div>

              <ThemeToggle />
            </div>

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
