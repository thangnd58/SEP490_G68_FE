import { useTranslation } from "react-i18next";

const usei18next = () => {
    // Use the `useTranslation` hook to access translation functions and the `i18n` object.
    const { t, i18n } = useTranslation();
  
    // Determine if the current language is Vietnamese ("vi").
    const isVn = i18n.language === "vi";
  
    // Get the current language.
    const lang = i18n.language;
  
    // Define a function to change the language and store it in localStorage.
    const changeLang = (flag: string) => {
      i18n.changeLanguage(flag);
      localStorage.setItem("lang", flag);
    };
  
    // Return the translation function, current language, changeLang function,
    // language check, and the `i18n` object.
    return { t, lang, changeLang, isVn, i18n };
  };
  

export default usei18next;