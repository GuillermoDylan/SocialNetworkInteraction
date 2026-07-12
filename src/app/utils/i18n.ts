import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation";
import chTranslations from "./locales/ch/translation";
import translation from "./locales/en/translation";

const resources = {
  en: {
    translation: enTranslations,
  },
  ch: {
    translation: chTranslations,
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Default language if detection fails

    interpolation: {
      escapeValue: false,
    },
  } as any);

export default i18n;