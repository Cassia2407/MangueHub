import { useState, useEffect, useRef } from "react";
import { RouterProvider } from "react-router";
import { useNavigate } from "react-router";
import { AuthModal } from "./components/AuthModal";
import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppSettingsProvider, useT, useAppSettings, type FontSizeOption, type ThemeOption } from "./contexts/AppSettingsContext";
import { router } from "./routes";
import mangueImg from "../imports/out2021mangurzalabre.jpg";
import mangue027Img from "../imports/images.jpg";
import { MakingOf } from "./components/making-of";
import { BrandLogo } from "./components/BrandLogo";
import { SettingsPopover as SettingsPopoverShared, LANG_OPTIONS, LANG_LATIN_NAMES } from "./components/SettingsPopover";
import iotImg from "../imports/WhatsApp_Image_2026-07-23_at_17.05.42.jpeg";
import plantExpressionsImg from "../imports/ChatGPT_Image_24_de_jul._de_2026__15_20_46.png";
import {
  Leaf,
  Droplets,
  Thermometer,
  Sun,
  Waves,
  MessageSquare,
  Heart,
  Search,
  Bell,
  ArrowRight,
  Home,
  Sprout,
  User,
  Wifi,
  Cpu,
  BatteryCharging,
  RadioTower,
  CheckCircle2,
  Menu,
  X,
  MessageCircle,
  PenLine,
  Reply,
  Droplet,
  Cloud,
  Users,
  Signal,
  Moon,
  Contrast,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "home" | "forum" | "plant";
type NavSection = "landing" | "iot" | "como-funciona" | "planta" | "app";

// ─── Live sensor data ───────────────────────────────────────────────────────────

function useLiveSensors() {
  const [data, setData] = useState({
    humidity: 68,
    temperature: 28,
    waterLevel: 42,
    luminosity: 320,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => ({
        humidity: Math.min(95, Math.max(40, d.humidity + (Math.random() - 0.5) * 2)),
        temperature: Math.min(35, Math.max(20, d.temperature + (Math.random() - 0.5) * 0.5)),
        waterLevel: Math.min(80, Math.max(20, d.waterLevel + (Math.random() - 0.5) * 1.5)),
        luminosity: Math.min(600, Math.max(120, d.luminosity + (Math.random() - 0.5) * 20)),
      }));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return data;
}

// ─── Shared UI ──────────────────────────────────────────────────────────────────

function Badge({
  children,
  variant = "green",
}: {
  children: React.ReactNode;
  variant?: "green" | "outline";
}) {
  const styles = {
    green: "bg-accent/15 text-accent border border-accent/30",
    outline: "border border-primary-foreground/25 text-primary-foreground/80",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}

function LiveDot({ label = "AO VIVO" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-accent">
      <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
      {label}
    </span>
  );
}

// ─── Settings (shared) ────────────────────────────────────────────────────────
// LANG_OPTIONS, LANG_LATIN_NAMES, and SettingsPopover live in components/SettingsPopover.tsx

function MobileSettingsInline() {
  const { theme, setTheme, language, setLanguage, fontSize, setFontSize, highContrast, setHighContrast } = useAppSettings();
  const t = useT();
  const themeOptions: { value: ThemeOption; lk: string; icon: React.ElementType }[] = [
    { value: "light", lk: "settings.themeLight", icon: Sun },
    { value: "dark",  lk: "settings.themeDark",  icon: Moon },
  ];
  const fontOptions: { s: FontSizeOption; lk: string }[] = [
    { s: "Padrão",       lk: "settings.fontDefault" },
    { s: "Médio",        lk: "settings.fontMedium" },
    { s: "Grande",       lk: "settings.fontLarge" },
    { s: "Muito grande", lk: "settings.fontXLarge" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {/* Tema */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>{t("settings.theme")}</p>
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map(({ value, lk, icon: Icon }) => (
            <button key={value} onClick={() => setTheme(value)}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-sm border transition-all ${theme === value ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}
              style={{ fontWeight: theme === value ? 600 : 400 }}>
              <Icon size={14} /> {t(lk)}
            </button>
          ))}
        </div>
      </div>
      {/* Idioma */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>{t("settings.language")}</p>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground outline-none appearance-none">
          {LANG_OPTIONS.map((lang) => <option key={lang} value={lang}>{LANG_LATIN_NAMES[lang] ? `${lang} — ${LANG_LATIN_NAMES[lang]}` : lang}</option>)}
        </select>
      </div>
      {/* Fonte */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2" style={{ fontWeight: 700 }}>{t("settings.fontSize")}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {fontOptions.map(({ s, lk }) => (
            <button key={s} onClick={() => setFontSize(s)}
              className={`py-1.5 rounded-lg text-[11px] border transition-all ${fontSize === s ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}
              style={{ fontWeight: fontSize === s ? 600 : 400 }}>
              {t(lk)}
            </button>
          ))}
        </div>
      </div>
      {/* Alto contraste */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Contrast size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{t("settings.highContrast")}</span>
        </div>
        <button type="button" onClick={() => setHighContrast(!highContrast)}
          className={`relative w-10 h-6 rounded-full transition-colors ${highContrast ? "bg-accent" : "bg-muted"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? "translate-x-4" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
}

function TranslationLoadingBar() {
  const { translationLoading, translationProgress } = useAppSettings();
  if (!translationLoading) return null;
  return (
    <div className="fixed top-16 left-0 right-0 z-[200] h-0.5 bg-accent/20">
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${translationProgress}%` }}
      />
    </div>
  );
}

const SettingsPopover = SettingsPopoverShared;

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  onNav,
  onMakingOf,
  onLogin,
  onSignup,
}: {
  onNav: (s: NavSection) => void;
  onMakingOf: () => void;
  onLogin: () => void;
  onSignup: () => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const links: [string, NavSection][] = [
    [t("landing.nav.iot"), "iot"],
    [t("landing.nav.howItWorks"), "como-funciona"],
    [t("landing.nav.plant"), "planta"],
    [t("landing.nav.app"), "app"],
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => onNav("landing")} className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-lg text-foreground tracking-tight" style={{ fontWeight: 800 }}>FalaMangue!</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(([label, section]) => (
            <button
              key={section}
              onClick={() => onNav(section)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={onMakingOf}
            className="px-3 py-1.5 text-sm text-accent hover:text-accent/80 rounded-lg hover:bg-accent/10 transition-colors"
            style={{ fontWeight: 600 }}
          >
            {t("landing.makingOf")}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={onLogin} className="px-4 py-2 text-sm text-foreground rounded-xl hover:bg-muted/60 transition-colors">
            {t("landing.login")}
          </button>
          <button onClick={onSignup} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors" style={{ fontWeight: 600 }}>
            {t("landing.signup")}
          </button>
          <SettingsPopover />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/60 text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-1">
          {links.map(([label, section]) => (
            <button
              key={section}
              onClick={() => { onNav(section); setOpen(false); }}
              className="text-left px-3 py-2.5 text-sm text-foreground rounded-xl hover:bg-muted/60"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { onMakingOf(); setOpen(false); }}
            className="text-left px-3 py-2.5 text-sm text-accent rounded-xl hover:bg-accent/10"
            style={{ fontWeight: 600 }}
          >
            {t("landing.makingOf")}
          </button>
          <div className="flex gap-2 pt-3 mt-1 border-t border-border">
            <button onClick={() => { onLogin(); setOpen(false); }} className="flex-1 py-2.5 text-sm text-foreground rounded-xl border border-border hover:bg-muted/60">
              {t("landing.login")}
            </button>
            <button onClick={() => { onSignup(); setOpen(false); }} className="flex-1 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl" style={{ fontWeight: 600 }}>
              {t("landing.signup")}
            </button>
          </div>
          {/* Quick settings no mobile */}
          <div className="pt-3 mt-1 border-t border-border">
            <MobileSettingsInline />
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  const t = useT();
  const tags = [t("landing.hero.tagCommunity"), t("landing.hero.tagSustainability"), t("landing.hero.tagInnovation"), t("landing.hero.tagUniversity")];
  return (
    <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <div className="inline-flex">
            <Badge variant="green">
              <Wifi size={11} />
              {t("landing.hero.badge")}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight" style={{ fontWeight: 800 }}>
              {t("landing.hero.titlePre")} <span className="text-accent">{t("landing.hero.titleAccent")}</span> {t("landing.hero.titlePost")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {t("landing.hero.desc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onSignup} className="px-6 py-3 text-sm bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
              {t("landing.signup")} <ArrowRight size={15} />
            </button>
            <button onClick={onLogin} className="px-6 py-3 text-sm bg-card border border-border text-foreground rounded-2xl hover:bg-muted/50 transition-colors" style={{ fontWeight: 600 }}>
              {t("landing.login")}
            </button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 aspect-[4/3]">
            <img
              src={mangueImg}
              alt="Manguezal monitorado com tecnologia IoT"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
              <p className="text-2xl sm:text-3xl tracking-tight" style={{ fontWeight: 800 }}>FalaMangue!</p>
              <p className="text-sm text-white/80 mb-4">{t("landing.hero.cardSubtitle")}</p>
              <div className="flex flex-col gap-2 max-w-xs">
                <button onClick={onLogin} className="w-full py-2.5 bg-accent text-accent-foreground rounded-xl text-sm" style={{ fontWeight: 600 }}>
                  {t("landing.login")}
                </button>
                <button onClick={onSignup} className="w-full py-2.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-xl text-sm" style={{ fontWeight: 600 }}>
                  {t("landing.signup")}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute -top-8 -right-8 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
}

// ─── IoT interaction section ────────────────────────────────────────────────────

function SensorRow({
  icon: Icon,
  label,
  value,
  unit,
  percent,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  unit: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm text-primary-foreground/80">{label}</span>
          <span className="text-sm text-primary-foreground" style={{ fontWeight: 700, fontFamily: "DM Mono, monospace" }}>
            {value}
            <span className="text-primary-foreground/50 ml-1">{unit}</span>
          </span>
        </div>
        <div className="h-1.5 bg-primary-foreground/15 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${Math.max(4, Math.min(100, percent))}%` }} />
        </div>
      </div>
    </div>
  );
}

function IoTSection() {
  const t = useT();
  const s = useLiveSensors();
  return (
    <section id="iot" className="py-16 sm:py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-6">
          <Badge variant="outline">
            <RadioTower size={11} className="text-accent" />
            <span className="text-accent">{t("landing.iot.badge")}</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl leading-tight" style={{ fontWeight: 800 }}>
            {t("landing.iot.titlePre")} <span className="text-accent">{t("landing.iot.titleAccent")}</span>
          </h2>
          <p className="text-primary-foreground/70 leading-relaxed max-w-md">
            {t("landing.iot.desc")}
          </p>

          <div className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-3xl p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-foreground/60">Mangue Vermelho #027</span>
              <LiveDot />
            </div>
            <SensorRow icon={Droplets} label={t("plant.humidity")} value={s.humidity.toFixed(0)} unit="%" percent={s.humidity} color="bg-blue-500" />
            <SensorRow icon={Waves} label={t("plant.waterLevel")} value={s.waterLevel.toFixed(0)} unit="cm" percent={(s.waterLevel / 80) * 100} color="bg-cyan-500" />
            <SensorRow icon={Thermometer} label={t("plant.temperature")} value={s.temperature.toFixed(0)} unit="°C" percent={((s.temperature - 15) / 20) * 100} color="bg-orange-500" />
            <SensorRow icon={Sun} label={t("plant.sunlight")} value={s.luminosity.toFixed(0)} unit="lux" percent={(s.luminosity / 600) * 100} color="bg-amber-500" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl shadow-black/40">
              <img
                src={iotImg}
                alt="Planta de mangue equipada com sensores IoT"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
              <div className="w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center">
                <Cpu size={14} className="text-accent" />
              </div>
              <div>
                <p className="text-[11px] text-foreground" style={{ fontWeight: 700 }}>Mangue IoT</p>
                <p className="text-[9px] text-muted-foreground">ESP32 · online</p>
              </div>
            </div>
          </div>

          {/* Expressões da planta */}
          <div className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-3xl overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="text-sm text-primary-foreground" style={{ fontWeight: 700 }}>{t("landing.iot.howReacts")}</p>
              <p className="text-xs text-primary-foreground/55 mt-0.5">
                {t("landing.iot.ledDesc")}
              </p>
            </div>
            <img
              src={plantExpressionsImg}
              alt="Expressões da planta — Matriz LED 8x8: Feliz, Triste, Dormindo, Gota, Coração e Sol"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const t = useT();
  const steps = [
    { icon: MessageSquare, title: t("landing.how.step1title"), desc: t("landing.how.step1desc") },
    { icon: Leaf, title: t("landing.how.step2title"), desc: t("landing.how.step2desc") },
    { icon: Droplet, title: t("landing.how.step3title"), desc: t("landing.how.step3desc") },
    { icon: Sprout, title: t("landing.how.step4title"), desc: t("landing.how.step4desc") },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center gap-3">
          <Badge variant="green">{t("landing.how.badge")}</Badge>
          <h2 className="text-3xl sm:text-4xl text-foreground" style={{ fontWeight: 800 }}>{t("landing.how.title")}</h2>
          <p className="text-muted-foreground max-w-md">
            {t("landing.how.desc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
                  <s.icon size={20} />
                </div>
                <span className="text-3xl text-muted/50" style={{ fontWeight: 800, fontFamily: "DM Mono, monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="text-foreground mb-1" style={{ fontWeight: 700 }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Plant status card ──────────────────────────────────────────────────────────

function PlantCardSection() {
  const t = useT();
  const features = [t("landing.plant.feature1"), t("landing.plant.feature2"), t("landing.plant.feature3")];
  return (
    <section id="planta" className="py-16 sm:py-20 px-4 sm:px-6 bg-secondary">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="flex flex-col gap-4">
          <Badge variant="green">{t("landing.plant.badge")}</Badge>
          <h2 className="text-3xl sm:text-4xl text-foreground leading-tight" style={{ fontWeight: 800 }}>
            {t("landing.plant.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            {t("landing.plant.desc")}
          </p>
          <div className="flex flex-col gap-3 pt-2">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
          <div className="relative h-48 sm:h-52">
            <img
              src={mangue027Img}
              alt="Mangue Vermelho #027"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full shadow-sm" style={{ fontWeight: 600 }}>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {t("landing.plant.healthy")}
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Sprout size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="text-foreground" style={{ fontWeight: 700 }}>Mangue Vermelho #027</h3>
                <p className="text-sm text-muted-foreground">{t("landing.plant.cardHeight")}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{t("landing.plant.growth")}</span>
                <span className="text-accent" style={{ fontWeight: 700 }}>78%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "78%" }} />
              </div>
            </div>

            <button className="w-full py-3 bg-primary text-primary-foreground text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
              {t("landing.plant.viewDetails")} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── App: Início ────────────────────────────────────────────────────────────────

function AppHome() {
  const t = useT();
  const quick = [
    { label: t("landing.app.home.newPost"), icon: PenLine },
    { label: t("landing.app.home.replies"), icon: Reply },
    { label: t("landing.app.home.waterPlant"), icon: Droplet },
    { label: t("landing.app.home.sensors"), icon: RadioTower },
  ];
  const hotTopicsData = [
    { id: 1, title: t("landing.demo.topic1.title"), meta: t("landing.demo.topic1.meta"), course: "Química" },
    { id: 2, title: t("landing.demo.topic2.title"), meta: t("landing.demo.topic2.meta"), course: "Eng. Ambiental" },
    { id: 3, title: t("landing.demo.topic3.title"), meta: t("landing.demo.topic3.meta"), course: "Biologia" },
  ];

  return (
    <div className="p-8 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{t("landing.app.home.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("landing.app.home.greeting")}</p>
        </div>
        <button className="relative w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border shadow-sm">
          <Bell size={18} className="text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna principal (2/3) */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Planta */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={mangueImg} alt="Planta" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-base text-foreground" style={{ fontWeight: 600 }}>{t("landing.app.home.yourPlant")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("landing.app.home.plantDesc")}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2" style={{ fontWeight: 600 }}>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {t("landing.app.home.healthy")}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground">{t("landing.app.home.growth")}</span>
                  <span className="text-sm text-accent" style={{ fontWeight: 600 }}>78%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
            </div>

            {/* Pontos */}
            <div className="bg-primary rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <p className="text-primary-foreground/60 text-sm">{t("landing.app.home.yourPoints")}</p>
              <p className="text-primary-foreground" style={{ fontWeight: 800, fontSize: "2.25rem", fontFamily: "DM Mono, monospace" }}>2.450</p>
              <div className="flex items-end justify-between">
                <p className="text-sm text-accent">{t("landing.app.home.thisWeek")}</p>
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <Leaf size={22} className="text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <p className="text-base text-foreground mb-3" style={{ fontWeight: 600 }}>{t("landing.app.home.quickActions")}</p>
            <div className="grid grid-cols-4 gap-3">
              {quick.map(({ label, icon: Icon }) => (
                <button key={label} className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 border border-border shadow-sm hover:border-accent/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs text-foreground text-center" style={{ fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna lateral (1/3) — Tópicos em alta */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-base text-foreground" style={{ fontWeight: 600 }}>{t("landing.app.home.hotTopics")}</p>
            <button className="text-sm text-accent" style={{ fontWeight: 500 }}>{t("landing.app.home.seeAll")}</button>
          </div>
          {hotTopicsData.map((topic) => (
            <div key={topic.id} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:border-accent/30 transition-colors cursor-pointer">
              <p className="text-sm text-foreground leading-snug mb-2" style={{ fontWeight: 600 }}>{topic.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-accent">{topic.course}</span>
                <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <span className="text-xs text-muted-foreground">{topic.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App: Fórum ─────────────────────────────────────────────────────────────────

function AppForum() {
  const t = useT();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    t("landing.app.forum.tabAll"),
    t("landing.app.forum.tabAcademic"),
    t("landing.app.forum.tabProjects"),
    t("landing.app.forum.tabQuestions"),
    t("landing.app.forum.tabEvents"),
  ];

  const forumPostsData = [
    {
      id: 1,
      author: "João Victor",
      course: "Engenharia Ambiental",
      time: t("landing.demo.post1.time"),
      title: t("landing.demo.post1.title"),
      content: t("landing.demo.post1.content"),
      tags: ["Água", "Pesquisa"],
      likes: 24,
      replies: 8,
      avatar: "JV",
    },
    {
      id: 2,
      author: "Beatriz Lima",
      course: "Biologia Marinha",
      time: t("landing.demo.post2.time"),
      title: t("landing.demo.post2.title"),
      content: t("landing.demo.post2.content"),
      tags: ["Biodiversidade", "Mangue"],
      likes: 56,
      replies: 12,
      avatar: "BL",
    },
    {
      id: 3,
      author: "Lucas Almeida",
      course: "Oceanografia",
      time: t("landing.demo.post3.time"),
      title: t("landing.demo.post3.title"),
      content: t("landing.demo.post3.content"),
      tags: ["Pesquisa", "CarbonoAzul"],
      likes: 12,
      replies: 5,
      avatar: "LA",
    },
  ];

  const filtered = forumPostsData.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-background min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{t("landing.app.forum.title")}</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm text-sm" style={{ fontWeight: 600 }}>
          <PenLine size={15} /> {t("landing.app.forum.newPost")}
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("landing.app.forum.search")}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <div className="flex gap-2">
          {tabs.map((tabLabel, idx) => (
            <button
              key={tabLabel}
              onClick={() => setActiveTab(idx)}
              className={`text-sm px-4 py-2.5 rounded-xl transition-colors ${
                activeTab === idx ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: 500 }}
            >
              {tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-accent/30 transition-colors cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-primary-foreground" style={{ fontWeight: 700 }}>{p.avatar}</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>{p.author}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{p.course} · {p.time}</p>
              </div>
            </div>
            <h4 className="text-base text-foreground mb-2 leading-snug" style={{ fontWeight: 600 }}>{p.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-xs text-accent bg-accent/10 px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>#{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-5 border-l border-border pl-5">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                  <Heart size={14} /> {p.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors">
                  <MessageCircle size={14} /> {p.replies} {t("landing.app.forum.replies")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App: Planta ────────────────────────────────────────────────────────────────

function AppPlant({ sensors }: { sensors: ReturnType<typeof useLiveSensors> }) {
  const t = useT();
  const cards = [
    { icon: Droplets, label: t("plant.humidity"), value: `${sensors.humidity.toFixed(0)}%`, color: "bg-blue-500" },
    { icon: Waves, label: t("plant.waterLevel"), value: `${sensors.waterLevel.toFixed(0)} cm`, color: "bg-cyan-500" },
    { icon: Thermometer, label: t("plant.temperature"), value: `${sensors.temperature.toFixed(0)}°C`, color: "bg-orange-500" },
    { icon: Sun, label: t("plant.sunlight"), value: `${sensors.luminosity.toFixed(0)} lux`, color: "bg-amber-500" },
  ];

  return (
    <div className="p-8 bg-background min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>{t("landing.app.plant.title")}</h2>
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> {t("landing.app.plant.connected")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Signal size={18} />
          <Wifi size={18} />
          <BatteryCharging size={18} className="text-accent" />
        </div>
      </div>

      {/* Imagem + sensores lado a lado */}
      <div className="grid grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: "240px" }}>
          <img src={mangueImg} alt="Planta de mangue" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-white bg-red-500/90 px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> {t("landing.app.plant.live")}
          </span>
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm" style={{ fontWeight: 600 }}>{t("landing.app.plant.camera")}</p>
            <p className="text-white/60 text-xs mt-0.5">{t("landing.app.plant.lastUpdate")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 content-start">
          {cards.map((c) => (
            <div key={c.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-foreground mt-0.5" style={{ fontWeight: 700, fontSize: "1.5rem", fontFamily: "DM Mono, monospace" }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crescimento */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base text-foreground" style={{ fontWeight: 600 }}>{t("landing.app.plant.growth")}</p>
          <span className="text-base text-accent" style={{ fontWeight: 700 }}>1,25 m · 78%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: "78%" }} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{t("landing.app.plant.goal")}</p>
      </div>
    </div>
  );
}

// ─── App preview (desktop window) ──────────────────────────────────────────────

function DesktopAppWindow({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const sensors = useLiveSensors();
  const tabs: { id: Screen; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Início", icon: Home },
    { id: "forum", label: "Fórum", icon: MessageSquare },
    { id: "plant", label: "Planta", icon: Sprout },
  ];

  return (
    <div className="w-full bg-background rounded-2xl overflow-hidden shadow-2xl shadow-black/30 flex flex-col border border-white/10">
      {/* Browser chrome */}
      <div className="bg-[#0f1f17] h-10 flex items-center px-4 gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/10 rounded-md h-5 flex items-center px-3">
          <span className="text-[11px] text-white/40">app.manguehub.com.br</span>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 min-h-0" style={{ height: "600px" }}>
        {/* Sidebar nav */}
        <div className="w-14 bg-card border-r border-border flex flex-col items-center py-4 gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mb-3">
            <Sprout size={15} className="text-primary-foreground" />
          </div>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              title={label}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                screen === id ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon size={17} />
            </button>
          ))}
          <div className="flex-1" />
          <button title="Perfil" className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
            <User size={17} />
          </button>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto">
          {screen === "home" && <AppHome />}
          {screen === "forum" && <AppForum />}
          {screen === "plant" && <AppPlant sensors={sensors} />}
        </div>
      </div>
    </div>
  );
}

function AppPreviewSection() {
  const t = useT();
  const [screen, setScreen] = useState<Screen>("home");
  const tabs: { id: Screen; label: string }[] = [
    { id: "home", label: t("landing.app.tabHome") },
    { id: "forum", label: t("landing.app.tabForum") },
    { id: "plant", label: t("landing.app.tabPlant") },
  ];
  const features = [t("landing.app.feature1"), t("landing.app.feature2"), t("landing.app.feature3")];

  return (
    <section id="app" className="py-16 sm:py-20 px-4 sm:px-6 bg-primary">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Badge variant="outline">
              <span className="text-accent">{t("landing.app.badge")}</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl text-primary-foreground leading-tight" style={{ fontWeight: 800 }}>
              {t("landing.app.titlePre")} <span className="text-accent">{t("landing.app.titleAccent")}</span>
            </h2>
            <p className="text-primary-foreground/70 leading-relaxed max-w-lg">
              {t("landing.app.desc")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                screen === id
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/60 border border-primary-foreground/20 hover:border-primary-foreground/40"
              }`}
              style={{ fontWeight: 500 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop window */}
        <DesktopAppWindow screen={screen} setScreen={setScreen} />
      </div>
    </section>
  );
}

// ─── IoT invention band ─────────────────────────────────────────────────────────

function InventionSection() {
  const t = useT();
  const flow = [
    { icon: RadioTower, title: t("landing.invention.step1title"), desc: t("landing.invention.step1desc") },
    { icon: Cloud, title: t("landing.invention.step2title"), desc: t("landing.invention.step2desc") },
    { icon: Users, title: t("landing.invention.step3title"), desc: t("landing.invention.step3desc") },
  ];
  const tech = [
    { icon: Cpu, label: "ESP32", desc: t("landing.iot.tech.esp32desc") },
    { icon: RadioTower, label: t("landing.iot.tech.sensorsLabel"), desc: t("landing.iot.tech.sensorsDesc") },
    { icon: Wifi, label: t("landing.iot.tech.connectLabel"), desc: t("landing.iot.tech.connectDesc") },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0f1f17] text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Flow */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl" style={{ fontWeight: 800 }}>{t("landing.invention.title")}</h2>
              <p className="text-white/60 text-sm mt-2 max-w-lg">{t("landing.invention.desc")}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {flow.map((f, i) => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                      <f.icon size={18} />
                    </div>
                    <span className="text-xs text-white/30" style={{ fontFamily: "DM Mono, monospace" }}>0{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{f.title}</p>
                    <p className="text-xs text-white/50 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 justify-center">
            <p className="text-sm text-accent" style={{ fontWeight: 600 }}>{t("landing.invention.purpose")}</p>
            <p className="text-sm text-white/70 leading-relaxed">{t("landing.invention.purposeText")}</p>
            <p className="text-lg leading-snug" style={{ fontWeight: 700 }}>
              "{t("landing.invention.quote")}"
            </p>
          </div>
        </div>

        {/* Tech */}
        <div>
          <p className="text-sm text-white/50 mb-4">{t("landing.invention.tech")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tech.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm text-accent" style={{ fontWeight: 600 }}>{item.label}</p>
                  <p className="text-[11px] text-white/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" className="ring-white/15" />
            <span className="text-sm" style={{ fontWeight: 700 }}>FalaMangue!</span>
          </div>
          <p className="text-xs text-white/30">{t("landing.footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  const [page, setPage] = useState<"platform" | "making-of">("platform");
  const [authModal, setAuthModal] = useState<null | "login" | "signup">(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleNav(section: NavSection) {
    if (section === "landing") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleLogin() {
    if (user) { navigate("/dashboard"); return; }
    setAuthModal("login");
  }

  function handleSignup() {
    if (user) { navigate("/dashboard"); return; }
    setAuthModal("signup");
  }

  if (page === "making-of") {
    return (
      <>
        <TranslationLoadingBar />
        <MakingOf onBack={() => { setPage("platform"); window.scrollTo({ top: 0 }); }} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <TranslationLoadingBar />
      <Navbar
        onNav={handleNav}
        onMakingOf={() => { setPage("making-of"); window.scrollTo({ top: 0 }); }}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      <main>
        <HeroSection onLogin={handleLogin} onSignup={handleSignup} />
        <IoTSection />
        <HowItWorksSection />
        <PlantCardSection />
        <AppPreviewSection />
        <InventionSection />
      </main>

      {authModal && (
        <AuthModal
          defaultTab={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

// ─── Root App with Router ─────────────────────────────────────────────────────

export default function App() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppSettingsProvider>
  );
}
