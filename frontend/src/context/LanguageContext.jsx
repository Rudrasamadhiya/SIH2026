import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translate } from "../lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLanguage = "en" }) {
  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((l) => (l === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback((key, vars) => translate(language, key, vars), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}