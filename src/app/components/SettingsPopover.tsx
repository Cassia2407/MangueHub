import { useState, useEffect, useRef } from "react";
import { Settings, Globe, ZoomIn, Contrast, Sun, Moon, Loader2 } from "lucide-react";
import { useAppSettings, useT, type FontSizeOption, type ThemeOption } from "../contexts/AppSettingsContext";

export const LANG_LATIN_NAMES: Record<string, string> = {
  "Ελληνικά (Ελλάδα)": "Greek",
  "Русский (Россия)": "Russian",
  "Українська (Україна)": "Ukrainian",
  "עברית (ישראל)": "Hebrew",
  "العربية (الإمارات)": "Arabic (UAE)",
  "العربية (السعودية)": "Arabic (Saudi Arabia)",
  "العربية (مصر)": "Arabic (Egypt)",
  "عربي (المغرب)": "Arabic (Morocco)",
  "فارسی (ایران)": "Persian",
  "हिन्दी (भारत)": "Hindi",
  "বাংলা (বাংলাদেশ)": "Bengali (Bangladesh)",
  "বাংলা (ভারত)": "Bengali (India)",
  "ภาษาไทย (ประเทศไทย)": "Thai",
  "한국어 (대한민국)": "Korean",
  "中文 (简体)": "Chinese (Simplified)",
  "中文 (繁體)": "Chinese (Traditional)",
  "日本語 (日本)": "Japanese",
};

export const LANG_OPTIONS = [
  "Afrikaans (Suid-Afrika)",
  "Bahasa Indonesia",
  "Bahasa Melayu (Malaysia)",
  "Čeština (Česká republika)",
  "Dansk (Danmark)",
  "Deutsch (Deutschland)",
  "Deutsch (Österreich)",
  "Deutsch (Schweiz)",
  "English (Australia)",
  "English (Canada)",
  "English (Ireland)",
  "English (New Zealand)",
  "English (South Africa)",
  "English (UK)",
  "English (US)",
  "Español (Argentina)",
  "Español (Bolivia)",
  "Español (Chile)",
  "Español (Colombia)",
  "Español (Costa Rica)",
  "Español (Cuba)",
  "Español (Ecuador)",
  "Español (España)",
  "Español (Guatemala)",
  "Español (México)",
  "Español (Paraguay)",
  "Español (Perú)",
  "Español (República Dominicana)",
  "Español (Uruguay)",
  "Español (Venezuela)",
  "Filipino (Pilipinas)",
  "Français (Belgique)",
  "Français (Canada)",
  "Français (France)",
  "Français (Suisse)",
  "Italiano (Italia)",
  "Italiano (Svizzera)",
  "Kiswahili (Kenya)",
  "Kiswahili (Tanzania)",
  "Magyar (Magyarország)",
  "Nederlands (België)",
  "Nederlands (Nederland)",
  "Norsk (Norge)",
  "Polski (Polska)",
  "Português (Brasil)",
  "Português (Portugal)",
  "Română (România)",
  "Suomi (Suomi)",
  "Svenska (Sverige)",
  "Tiếng Việt (Việt Nam)",
  "Türkçe (Türkiye)",
  "Xhosa (South Africa)",
  "Zulu (South Africa)",
  "Ελληνικά (Ελλάδα)",
  "Русский (Россия)",
  "Українська (Україна)",
  "עברית (ישראל)",
  "العربية (الإمارات)",
  "العربية (السعودية)",
  "العربية (مصر)",
  "عربي (المغرب)",
  "فارسی (ایران)",
  "हिन्दी (भारत)",
  "বাংলা (বাংলাদেশ)",
  "বাংলা (ভারত)",
  "ภาษาไทย (ประเทศไทย)",
  "한국어 (대한민국)",
  "中文 (简体)",
  "中文 (繁體)",
  "日本語 (日本)",
];

export function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme, language, setLanguage, fontSize, setFontSize, highContrast, setHighContrast, translationLoading } = useAppSettings();
  const t = useT();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fontOptions: { s: FontSizeOption; lk: string }[] = [
    { s: "Padrão",       lk: "settings.fontDefault" },
    { s: "Médio",        lk: "settings.fontMedium" },
    { s: "Grande",       lk: "settings.fontLarge" },
    { s: "Muito grande", lk: "settings.fontXLarge" },
  ];
  const themeOptions: { value: ThemeOption; lk: string; icon: React.ElementType }[] = [
    { value: "light", lk: "settings.themeLight", icon: Sun },
    { value: "dark",  lk: "settings.themeDark",  icon: Moon },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
          open || translationLoading
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/60"
        }`}
        aria-label="Configurações"
      >
        {translationLoading
          ? <Loader2 size={15} className="animate-spin" />
          : <Settings size={15} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 z-[200] overflow-hidden">
          {/* Tema */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2.5" style={{ fontWeight: 700 }}>
              {t("settings.theme")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map(({ value, lk, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-sm border transition-all ${
                    theme === value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  }`}
                  style={{ fontWeight: theme === value ? 600 : 400 }}
                >
                  <Icon size={14} /> {t(lk)}
                </button>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Globe size={12} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 700 }}>
                {t("settings.language")}
              </p>
              {translationLoading && (
                <Loader2 size={11} className="ml-auto text-accent animate-spin" />
              )}
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors appearance-none"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>{LANG_LATIN_NAMES[lang] ? `${lang} — ${LANG_LATIN_NAMES[lang]}` : lang}</option>
              ))}
            </select>
          </div>

          {/* Tamanho da fonte */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-1.5 mb-2.5">
              <ZoomIn size={12} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 700 }}>
                {t("settings.fontSize")}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {fontOptions.map(({ s, lk }) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`py-1.5 rounded-lg text-[11px] border transition-all ${
                    fontSize === s
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  }`}
                  style={{ fontWeight: fontSize === s ? 600 : 400 }}
                >
                  {t(lk)}
                </button>
              ))}
            </div>
          </div>

          {/* Alto contraste */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{t("settings.highContrast")}</span>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${highContrast ? "bg-accent" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
