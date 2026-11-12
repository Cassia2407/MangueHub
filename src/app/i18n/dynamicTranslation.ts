// Dynamic translation via Google Translate (unofficial, no API key needed)
// Caches per language in localStorage. Falls back to individual requests
// if batch separator is mangled.

const SEP = "\n⸻⸻\n";
const BATCH_SIZE = 25;
export const CACHE_PREFIX = "fm_dyn_";
const CONCURRENCY = 4;

// Display name → ISO 639-1 / BCP-47 code accepted by Google Translate
export const LANGUAGE_ISO: Record<string, string> = {
  // Portuguese
  "Português (Brasil)": "pt",
  "Português (Portugal)": "pt",
  // English — static, not used for dynamic
  "English (US)": "en",
  "English (UK)": "en",
  "English (Australia)": "en",
  "English (Canada)": "en",
  "English (Ireland)": "en",
  "English (New Zealand)": "en",
  "English (South Africa)": "en",
  // Spanish — static
  "Español (España)": "es",
  "Español (México)": "es",
  "Español (Argentina)": "es",
  "Español (Colombia)": "es",
  "Español (Chile)": "es",
  "Español (Perú)": "es",
  "Español (Venezuela)": "es",
  "Español (Uruguay)": "es",
  "Español (Paraguay)": "es",
  "Español (Bolivia)": "es",
  "Español (Ecuador)": "es",
  "Español (Guatemala)": "es",
  "Español (Cuba)": "es",
  "Español (República Dominicana)": "es",
  "Español (Honduras)": "es",
  "Español (El Salvador)": "es",
  "Español (Nicaragua)": "es",
  "Español (Costa Rica)": "es",
  "Español (Panamá)": "es",
  // French — static
  "Français (France)": "fr",
  "Français (Canada)": "fr",
  "Français (Belgique)": "fr",
  "Français (Suisse)": "fr",
  "Français (Luxembourg)": "fr",
  // German — static
  "Deutsch (Deutschland)": "de",
  "Deutsch (Österreich)": "de",
  "Deutsch (Schweiz)": "de",
  "Deutsch (Liechtenstein)": "de",
  "Deutsch (Luxemburg)": "de",
  // Italian — static
  "Italiano (Italia)": "it",
  "Italiano (Svizzera)": "it",
  // Dutch
  "Nederlands (Nederland)": "nl",
  "Nederlands (België)": "nl",
  // Nordic
  "Svenska (Sverige)": "sv",
  "Norsk (Norge)": "no",
  "Dansk (Danmark)": "da",
  "Suomi (Suomi)": "fi",
  // Eastern Europe
  "Polski (Polska)": "pl",
  "Čeština (Česká republika)": "cs",
  "Magyar (Magyarország)": "hu",
  "Română (România)": "ro",
  "Українська (Україна)": "uk",
  "Русский (Россия)": "ru",
  "Ελληνικά (Ελλάδα)": "el",
  "Türkçe (Türkiye)": "tr",
  // Southeast Asia
  "Bahasa Indonesia": "id",
  "Bahasa Melayu (Malaysia)": "ms",
  "Tiếng Việt (Việt Nam)": "vi",
  "ภาษาไทย (ประเทศไทย)": "th",
  "Filipino (Pilipinas)": "tl",
  // East Asia
  "日本語 (日本)": "ja",
  "한국어 (대한민국)": "ko",
  "中文 (简体)": "zh-CN",
  "中文 (繁體)": "zh-TW",
  // South Asia
  "हिन्दी (भारत)": "hi",
  "বাংলা (বাংলাদেশ)": "bn",
  "বাংলা (ভারত)": "bn",
  // Middle East / North Africa
  "العربية (السعودية)": "ar",
  "العربية (مصر)": "ar",
  "العربية (الإمارات)": "ar",
  "عربي (المغرب)": "ar",
  "فارسی (ایران)": "fa",
  "עברית (ישראל)": "iw",
  // Africa
  "Kiswahili (Kenya)": "sw",
  "Kiswahili (Tanzania)": "sw",
  "Afrikaans (Suid-Afrika)": "af",
  "Zulu (South Africa)": "zu",
  "Xhosa (South Africa)": "xh",
};

// Languages that have full static translations (no need for API)
const STATIC_PREFIXES = ["Português", "English", "Español", "Français", "Deutsch", "Italiano"];

export function needsDynamicTranslation(language: string): boolean {
  return !STATIC_PREFIXES.some((p) => language.startsWith(p));
}

export function getIsoCode(language: string): string | null {
  return LANGUAGE_ISO[language] ?? null;
}

async function translateOne(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const resp = await fetch(url);
    if (!resp.ok) return text;
    const data = await resp.json();
    return (data[0] as [string, string][]).map((p) => p[0]).join("") || text;
  } catch {
    return text;
  }
}

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  if (texts.length === 0) return [];
  try {
    const joined = texts.join(SEP);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const translated = (data[0] as [string, string][]).map((p) => p[0]).join("");
    const parts = translated.split(SEP);
    if (parts.length === texts.length) return parts.map((s) => s.trim());
    // Separator was mangled — fall back to individual requests
    return Promise.all(texts.map((t) => translateOne(t, targetLang)));
  } catch {
    // On any error fall back to individual (some will still succeed)
    return Promise.all(texts.map((t) => translateOne(t, targetLang)));
  }
}

export async function translateAll(
  englishStrings: Record<string, string>,
  targetLang: string,
  onProgress: (pct: number) => void
): Promise<Record<string, string>> {
  const keyCount = Object.keys(englishStrings).length;
  const cacheKey = `${CACHE_PREFIX}${targetLang}_n${keyCount}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      onProgress(100);
      return JSON.parse(cached) as Record<string, string>;
    }
  } catch {
    // ignore cache errors
  }

  const entries = Object.entries(englishStrings);
  const keys = entries.map(([k]) => k);
  const values = entries.map(([, v]) => v);

  const chunks: string[][] = [];
  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    chunks.push(values.slice(i, i + BATCH_SIZE));
  }

  const translated: string[] = new Array(values.length);
  let completed = 0;

  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const wave = chunks.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      wave.map((chunk) => translateBatch(chunk, targetLang))
    );
    results.forEach((result, waveIdx) => {
      const base = (i + waveIdx) * BATCH_SIZE;
      result.forEach((text, j) => {
        translated[base + j] = text;
      });
      completed += result.length;
      onProgress(Math.min(98, Math.round((completed / values.length) * 100)));
    });
  }

  const result: Record<string, string> = {};
  keys.forEach((key, idx) => {
    result[key] = translated[idx] ?? englishStrings[key];
  });

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // ignore storage errors (quota exceeded, private browsing, etc.)
  }

  onProgress(100);
  return result;
}

export function clearTranslationCache(language?: string): void {
  const all = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
  if (language) {
    const iso = getIsoCode(language);
    if (iso) all.filter((k) => k.includes(`_${iso}_`)).forEach((k) => localStorage.removeItem(k));
  } else {
    all.forEach((k) => localStorage.removeItem(k));
  }
}
