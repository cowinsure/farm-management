// context/LocalizationContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

import en from "../locales/en.json";
import bn from "../locales/bn.json";

type Locale = "en" | "bn";

type Translations = typeof en; // { welcome: string; login: string; ... }
type TranslationKey = keyof Translations; // "welcome" | "login" | "logout" | ...

interface LocalizationContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(
  undefined
);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("en");
  // This function automatically picks the right JSON file
  const t = (key: TranslationKey): string => {
    const dict = locale === "en" ? en : bn;
    return dict[key as keyof typeof dict] || key;
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context)
    throw new Error("useLocalization must be used within LocalizationProvider");
  return context;
};
