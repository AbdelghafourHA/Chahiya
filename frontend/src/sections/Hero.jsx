import { motion, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBellConcierge } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import heroImg from "../assets/Hero.jpg";

export default function Hero() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const stats = [
    { value: "08+", label: "فروع مميزة" },
    { value: "40+", label: "طهاة محترفون" },
    { value: "12+", label: "سنوات خبرة" },
  ];

  return (
    <motion.section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col text-primary-foreground overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Image with Parallax (disabled on mobile) */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...(!isMobile && { opacity, scale }),
        }}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Content */}
      <div className="relative z-10 container flex-1 flex flex-col justify-center pt-32 pb-10 mx-auto px-4">
        {/* Title */}
        <motion.h1
          variants={titleVariants}
          className="text-center font-heading text-4xl md:text-6xl lg:text-7xl mb-14 leading-tight tracking-wide"
        >
          فن الطعم الأصيل
        </motion.h1>

        {/* Sections */}
        <motion.div
          variants={containerVariants}
          className="grid gap-10 md:grid-cols-2 mb-10 text-center max-w-4xl mx-auto w-full"
        >
          {/* About */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-xs hover:bg-white/10 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <FontAwesomeIcon
                icon={faUtensils}
                className="text-3xl mb-4 text-secondary"
              />
            </motion.div>
            <h3 className="font-heading text-xl mb-3">من نحن</h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed mb-5">
              نقدم تجربة طعام فريدة تمزج بين الجودة العالية والنكهات الأصيلة
              لنصنع لحظات لا تُنسى لكل زبون.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-primary-foreground/40 px-5 py-2 rounded-full text-sm hover:bg-primary-foreground hover:text-text transition cursor-pointer inline-block"
            >
              تواصل معنا
            </motion.a>
          </motion.div>

          {/* Order */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-xs hover:bg-white/10 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <FontAwesomeIcon
                icon={faBellConcierge}
                className="text-3xl mb-4 text-secondary"
              />
            </motion.div>
            <h3 className="font-heading text-xl mb-3">اطلب الآن</h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed mb-5">
              اطلب وجبتك بسهولة واستمتع بسرعة التوصيل مع الحفاظ على جودة الطعام
              وطعمه المميز كما تحب.
            </p>
            <motion.a
              href="#order"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-secondary-foreground px-5 py-2 rounded-full text-sm hover:opacity-90 transition cursor-pointer inline-block"
            >
              اطلب الآن
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats (BOTTOM) */}
      <motion.div
        variants={containerVariants}
        className="relative z-10 border-t border-primary-foreground/20 py-6"
      >
        <div className="container max-w-4xl mx-auto px-4 flex justify-between text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              custom={index}
              className="flex-1"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-3xl font-heading mb-1"
              >
                {stat.value}
              </motion.p>
              <p className="text-xs text-primary-foreground/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
