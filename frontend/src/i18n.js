// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: "ar", // Default to Arabic
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Function to set the correct HTML dir based on language
export const updateDirection = (lng) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;

  // Also update body font family if needed
  if (lng === "ar") {
    document.body.style.fontFamily = "var(--font-body)"; // Tajawal/Cairo
  } else {
    document.body.style.fontFamily = "system-ui, -apple-system, sans-serif"; // Standard latin fonts
  }
};

// Listen to language changes
i18n.on("languageChanged", updateDirection);
updateDirection(i18n.language);

export default i18n;
