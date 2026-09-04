import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../utils/aiEngine';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rainai_lang') || 'en'; } catch { return 'en'; }
  });

  const changeLang = (code) => {
    setLang(code);
    try { localStorage.setItem('rainai_lang', code); } catch {}
    document.documentElement.dir = ['ur', 'ar'].includes(code) ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  useEffect(() => {
    document.documentElement.dir = ['ur', 'ar'].includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
};
