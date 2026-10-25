import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../i18n/en.json';
import taTranslations from '../i18n/ta.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  ta: taTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const legacy = localStorage.getItem('agrivision_language');
    if (legacy) {
      localStorage.removeItem('agrivision_language');
    }
    return localStorage.getItem('arka_assist_language') || legacy || 'en';
  });

  useEffect(() => {
    localStorage.setItem('arka_assist_language', language);
    localStorage.removeItem('agrivision_language');
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    const currentDict = translations[language] || translations.en;
    return currentDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
