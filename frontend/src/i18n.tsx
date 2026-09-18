import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

/** Par de strings traduzíveis: { pt, en } */
export type Translatable = { pt: string; en: string };

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Traduz um par { pt, en } para o idioma actual. */
  t: (v: Translatable) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "bcs.lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* localStorage indisponível (modo privado) — usa o padrão */
  }
  return "pt";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignora falha de persistência */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((l) => (l === "pt" ? "en" : "pt"));
  const t = (v: Translatable) => v[lang];

  return <Ctx.Provider value={{ lang, setLang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang deve ser usado dentro de <LanguageProvider>");
  return ctx;
}
