import { useTranslation } from "react-i18next";

const usei18next = () => {
    const { t, i18n } = useTranslation();
    const isVn = i18n.language === "vi";
    const lang = i18n.language;
    const changeLang = (flag: string) => {
      i18n.changeLanguage(flag);
      localStorage.setItem("lang", flag);
    };
    return { t, lang, changeLang, isVn, i18n };
  };
  

export default usei18next;