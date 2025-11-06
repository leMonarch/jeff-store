import { defineStore } from "pinia";
import { ref, watch } from "vue";
import i18n from "../i18n";

export const useLocaleStore = defineStore("locale", () => {
  const currentLocale = ref<string>(i18n.global.locale.value);

  function setLocale(locale: "fr" | "en") {
    i18n.global.locale.value = locale;
    currentLocale.value = locale;
    localStorage.setItem("locale", locale);
  }

  function getLocale(): "fr" | "en" {
    return currentLocale.value as "fr" | "en";
  }

  // Initialiser depuis localStorage
  function initialize() {
    const saved = localStorage.getItem("locale");
    if (saved && (saved === "fr" || saved === "en")) {
      setLocale(saved);
    }
  }

  // Synchroniser avec i18n
  watch(
    () => i18n.global.locale.value,
    (newLocale) => {
      currentLocale.value = newLocale;
      localStorage.setItem("locale", newLocale);
    }
  );

  return {
    currentLocale,
    setLocale,
    getLocale,
    initialize,
  };
});

