import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resource } from '../assets/locales/index';

const lang = localStorage.getItem('lang');

export default i18n
  .use(initReactI18next)
  .init({
    resources: resource,
    fallbackLng: lang || "vi",
    interpolation: {
      escapeValue: false
    }
  });