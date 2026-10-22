"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../translations/en.json";
import hi from "../translations/hi.json";
import mr from "../translations/mr.json";

export type Language = "en" | "hi" | "mr";

const translations: Record<Language, any> = { en, hi, mr };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  resetLanguage: () => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always default to English before language selection or on fresh load
  const [language, setLanguageState] = useState<Language>("en");

  // Reset language to English on mount/refresh (never remember across sessions/logout)
  useEffect(() => {
    setLanguageState("en");
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      sessionStorage.setItem("khetsaathi_session_lang", lang);
    } catch (e) {}
  };

  const resetLanguage = () => {
    setLanguageState("en");
    try {
      sessionStorage.removeItem("khetsaathi_session_lang");
      localStorage.removeItem("khetsaathi_session_lang");
    } catch (e) {}
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = translations[language] || translations["en"];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English if missing in target language
        let fallback: any = translations["en"];
        for (const k of keys) {
          if (fallback && typeof fallback === "object" && k in fallback) {
            fallback = fallback[k];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === "string" ? fallback : keyPath;
      }
    }

    return typeof current === "string" ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, resetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
