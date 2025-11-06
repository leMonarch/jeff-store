import { createI18n } from 'vue-i18n';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Récupérer la langue depuis localStorage ou détecter depuis le navigateur
const getDefaultLocale = (): string => {
  const saved = localStorage.getItem('locale');
  if (saved && (saved === 'fr' || saved === 'en')) {
    return saved;
  }
  
  // Détecter la langue du navigateur
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'en' || browserLang === 'fr') {
    return browserLang;
  }
  
  return 'fr'; // Par défaut français
};

const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
  },
  legacy: false, // Utiliser la Composition API
});

export default i18n;

