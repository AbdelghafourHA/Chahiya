// sections/Contact.jsx
import { motion } from "framer-motion";
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
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: { y: -5, transition: { duration: 0.2 } },
};

const socialIconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const workingHoursVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function Contact() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: faFacebook, href: "#", name: "Facebook", color: "#1877f2" },
    { icon: faInstagram, href: "#", name: "Instagram", color: "#e4405f" },
    { icon: faWhatsapp, href: "#", name: "WhatsApp", color: "#25d366" },
  ];

  const workingHours = [
    {
      day: t("contact.days.satWed", "السبت - الأربعاء"),
      hours: "12:00 - 23:00",
    },
    { day: t("contact.days.thu", "الخميس"), hours: "14:00 - 00:00" },
    {
      day: t("contact.days.fri", "الجمعة"),
      hours: t("contact.days.closed", "مغلق"),
    },
  ];

  return (
    <motion.section
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-20 bg-surface text-text transition-colors duration-300"
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl">
            {t("contact.title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* RIGHT - Contact Info */}
          <motion.div
            variants={containerVariants}
            className="space-y-8 md:text-start"
          >
            {/* Logo & Brand */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-primary font-heading text-2xl md:justify-start"
            >
              <FontAwesomeIcon icon={faBurger} />
              <span>شهية</span>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="space-y-4 bg-background border border-border rounded-2xl p-5"
            >
              <h3 className="text-lg font-heading border-s-2 border-primary ps-3">
                {t("contact.infoTitle")}
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <motion.a
                  href="tel:0550000000"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all duration-200"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-primary text-sm"
                    />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted">{t("contact.phone")}</p>
                    <p className="text-sm font-medium" dir="ltr">
                      +213 550 00 00 00
                    </p>
                  </div>
                </motion.a>

                {/* Location */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all duration-200"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-primary text-sm"
                    />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted">
                      {t("contact.location")}
                    </p>
                    <p className="text-sm">{t("contact.locationDesc")}</p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all duration-200"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary text-sm"
                    />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted">{t("contact.email")}</p>
                    <p className="text-sm">chahiya@gmail.com</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Working Hours */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-background border border-border rounded-2xl p-5"
            >
              <h3 className="text-lg font-heading border-s-2 border-primary ps-3 mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-primary text-sm"
                />
                {t("contact.hoursTitle")}
              </h3>
              <div className="space-y-3">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={workingHoursVariants}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center border-b border-border pb-2 last:border-0"
                  >
                    <span className="text-sm">{item.day}</span>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`text-sm ${
                        item.hours === t("contact.days.closed", "مغلق")
                          ? "text-red-500 dark:text-red-400"
                          : "text-muted"
                      }`}
                    >
                      {item.hours}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-background border border-border rounded-2xl p-5"
            >
              <h3 className="text-lg font-heading border-s-2 border-primary ps-3 mb-4">
                {t("contact.followUs")}
              </h3>
              <div className="flex gap-4 md:justify-start">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={socialIconVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center group"
                    aria-label={social.name}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className="text-muted group-hover:text-primary transition text-lg"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* LEFT - Map */}
          <motion.div variants={containerVariants} className="space-y-4">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-background border border-border rounded-2xl p-5"
            >
              <h3 className="text-lg font-heading border-s-2 border-primary ps-3 mb-4">
                {t("contact.mapTitle")}
              </h3>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full h-[280px] md:h-[400px] rounded-xl overflow-hidden border border-border"
              >
                <iframe
                  title="Restaurant Location"
                  src="https://maps.google.com/maps?q=Algiers+Algeria&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -3 }}
              className="bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-5 border border-primary/20"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-3xl"
                >
                  🍕
                </motion.div>
                <div>
                  <p className="text-sm font-medium">
                    {t("contact.safeOrder")}
                  </p>
                  <p className="text-xs text-muted">
                    {t("contact.safeOrderDesc")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
