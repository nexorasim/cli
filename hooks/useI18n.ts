import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, Locale } from '../lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof translations.en) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: keyof typeof translations.en): string => {
    return translations[locale][key] || translations.en[key];
  };

  return React.createElement(I18nContext.Provider, { value: { locale, setLocale, t } }, children);
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};