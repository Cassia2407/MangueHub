import { createContext, useContext, useState, useEffect, useRef } from "react";
import { type Locale, getLocale, translate, getAllEnglishStrings } from "../i18n/translations";
import { needsDynamicTranslation, getIsoCode, translateAll, CACHE_PREFIX } from "../i18n/dynamicTranslation";

export type FontSizeOption = "Padrão" | "Médio" | "Grande" | "Muito grande";
export type ThemeOption = "light" | "dark" | "system";

const FONT_SIZE_MAP: Record<FontSizeOption, string> = {
  "Padrão": "16px",
  "Médio": "18px",
  "Grande": "20px",
  "Muito grande": "23px",
};

interface AppSettings {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  fontSize: FontSizeOption;
  setFontSize: (v: FontSizeOption) => void;
  language: string;
  setLanguage: (v: string) => void;
  locale: Locale;
  theme: ThemeOption;
  setTheme: (v: ThemeOption) => void;
  dynamicT: Record<string, string> | null;
  translationLoading: boolean;
  translationProgress: number;
}

const AppSettingsContext = createContext<AppSettings>({
  highContrast: false,
  setHighContrast: () => {},
  fontSize: "Padrão",
  setFontSize: () => {},
  language: "Português (Brasil)",
  setLanguage: () => {},
  locale: "pt-BR",
  theme: "system",
  setTheme: () => {},
  dynamicT: null,
  translationLoading: false,
  translationProgress: 0,
});

const STORAGE_KEY = "falamangue_settings";

// Synchronously reads the cached translation for a language (if any).
// Used to populate dynamicT before the first render so the UI never flashes English.
function loadCachedTranslation(language: string): Record<string, string> | null {
  if (!needsDynamicTranslation(language)) return null;
  const isoCode = getIsoCode(language);
  if (!isoCode) return null;
  try {
    const keyCount = Object.keys(getAllEnglishStrings()).length;
    const cacheKey = `${CACHE_PREFIX}${isoCode}_n${keyCount}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Record<string, string>;
  } catch {
    // ignore
  }
  return null;
}

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed[key] ?? fallback;
  } catch {
    return fallback;
  }
}

function applyTheme(theme: ThemeOption) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrastState] = useState<boolean>(() => load("highContrast", false));
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => load("fontSize", "Padrão"));
  const [language, setLanguageState] = useState<string>(() => load("language", "Português (Brasil)"));
  const [theme, setThemeState] = useState<ThemeOption>(() => load("theme", "system"));
  const [dynamicT, setDynamicT] = useState<Record<string, string> | null>(() =>
    loadCachedTranslation(load("language", "Português (Brasil)"))
  );
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  // Track the current request so a stale response from a previous language is discarded
  const pendingLangRef = useRef<string | null>(null);
  // Keep previous dynamicT alive during loading so the UI never reverts to English mid-switch
  const prevDynamicTRef = useRef<Record<string, string> | null>(null);

  const locale: Locale = getLocale(language);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ highContrast, fontSize, language, theme }));
  }, [highContrast, fontSize, language, theme]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", FONT_SIZE_MAP[fontSize]);
  }, [fontSize]);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Dynamic translation effect
  useEffect(() => {
    if (!needsDynamicTranslation(language)) {
      prevDynamicTRef.current = null;
      setDynamicT(null);
      setTranslationLoading(false);
      setTranslationProgress(0);
      pendingLangRef.current = null;
      return;
    }

    const isoCode = getIsoCode(language);
    if (!isoCode) {
      setDynamicT(null);
      return;
    }

    pendingLangRef.current = language;
    setTranslationLoading(true);
    setTranslationProgress(0);
    // Keep the previous translation visible while the new one loads
    if (prevDynamicTRef.current) setDynamicT(prevDynamicTRef.current);

    const englishStrings = getAllEnglishStrings();

    translateAll(englishStrings, isoCode, (pct) => {
      if (pendingLangRef.current === language) {
        setTranslationProgress(pct);
      }
    }).then((result) => {
      if (pendingLangRef.current === language) {
        prevDynamicTRef.current = result;
        setDynamicT(result);
        setTranslationLoading(false);
        setTranslationProgress(100);
      }
    }).catch(() => {
      if (pendingLangRef.current === language) {
        setTranslationLoading(false);
      }
    });
  }, [language]);

  return (
    <AppSettingsContext.Provider value={{
      highContrast,
      setHighContrast: setHighContrastState,
      fontSize,
      setFontSize: setFontSizeState,
      language,
      setLanguage: setLanguageState,
      locale,
      theme,
      setTheme: setThemeState,
      dynamicT,
      translationLoading,
      translationProgress,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

export function useT() {
  const { locale, dynamicT } = useContext(AppSettingsContext);
  return (key: string) => {
    if (dynamicT !== null) return dynamicT[key] ?? translate(key, locale);
    return translate(key, locale);
  };
}
