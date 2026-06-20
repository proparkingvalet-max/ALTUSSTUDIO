import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "el" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

import { translations } from "@/translations";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("altus_lang");
    return (saved === "el" || saved === "en") ? saved : "el";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("altus_lang", l);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = translations[lang];
    for (const k of keys) {
      if (val && typeof val === "object") val = val[k];
      else return key;
    }
    return val !== undefined ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
