import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Mail, Lock, User, BookOpen, ArrowRight, Eye, EyeOff, Check, X as XIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useT } from "../contexts/AppSettingsContext";
import { BrandLogo } from "./BrandLogo";

interface AuthModalProps {
  defaultTab?: "login" | "signup";
  onClose: () => void;
}

const COURSES = [
  "Administração (Bacharelado)",
  "Análise e Desenvolvimento de Sistemas",
  "Aprendizagem Organizacional",
  "Comércio Exterior",
  "Cursos de extensão",
  "Design de Interiores",
  "Design de Moda",
  "Economia Circular",
  "Educação Financeira",
  "Enfermagem",
  "Estética e Cosmética",
  "Gastronomia",
  "Gestão Ambiental",
  "Gestão Comercial",
  "Gestão da Qualidade",
  "Gestão de Compras e Redes de Suprimentos",
  "Gestão de Compliance e Políticas Corporativas",
  "Gestão de Farmácias",
  "Gestão de Recursos Humanos",
  "Gestão Financeira",
  "Gestão Social e Desenvolvimento Comunitário",
  "Jogos Digitais",
  "Logística",
  "Marketing",
  "Pós-graduação",
  "Secretariado",
  "Transformação Digital da Gestão Escolar",
  "Vendas Corporativas",
  "Outro",
];

export function AuthModal({ defaultTab = "login", onClose }: AuthModalProps) {
  const t = useT();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCourse, setSignupCourse] = useState("");
  const [signupOtherCourse, setSignupOtherCourse] = useState("");
  const [signupPass, setSignupPass] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validatePassword(pass: string): string | null {
    if (pass.length < 8) return t("settings.pwdTooShort");
    if (!/[a-z]/.test(pass)) return t("auth.rule.lowercase");
    if (!/[A-Z]/.test(pass)) return t("auth.rule.uppercase");
    if (!/[0-9]/.test(pass)) return t("auth.rule.number");
    if (!/[@#%!$&*^]/.test(pass)) return t("auth.rule.special");
    return null;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!emailRegex.test(loginEmail)) {
      setError(t("auth.error.invalidEmail"));
      return;
    }
    const passError = validatePassword(loginPass);
    if (passError) {
      setError(passError);
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      onClose();
      navigate("/dashboard");
    } catch {
      setError(t("auth.error.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  const effectiveCourse = signupCourse === "Outro" ? signupOtherCourse.trim() : signupCourse;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!signupName || !signupEmail || !signupCourse || !signupPass) {
      setError(t("auth.error.fillAll"));
      return;
    }
    if (signupCourse === "Outro" && !signupOtherCourse.trim()) {
      setError(t("auth.error.fillCourse"));
      return;
    }
    if (!emailRegex.test(signupEmail)) {
      setError(t("auth.error.invalidEmail"));
      return;
    }
    const passError = validatePassword(signupPass);
    if (passError) {
      setError(passError);
      return;
    }
    setLoading(true);
    try {
      await signup(signupName, signupEmail, effectiveCourse, signupPass);
      onClose();
      navigate("/dashboard");
    } catch {
      setError(t("auth.error.signupFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl shadow-black/30 overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary px-6 pt-6 pb-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/15 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/5 rounded-full" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
          <div className="relative flex items-center gap-2.5 mb-5">
            <BrandLogo size="lg" className="ring-white/20" />
            <span className="text-white text-lg tracking-tight" style={{ fontWeight: 800 }}>
              FalaMangue!
            </span>
          </div>
          <h2 className="relative text-white text-2xl leading-tight" style={{ fontWeight: 800 }}>
            {tab === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}
          </h2>
          <p className="relative text-white/60 text-sm mt-1">
            {tab === "login" ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
          </p>
        </div>

        {/* Tab switcher — only shown when opened from login entry point */}
        <div className={`flex border-b border-border ${defaultTab === "signup" ? "hidden" : ""}`}>
          {(["login", "signup"] as const).map((tabId) => (
            <button
              key={tabId}
              onClick={() => { setTab(tabId); setError(""); }}
              className={`flex-1 py-3.5 text-sm transition-colors relative ${
                tab === tabId
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: tab === tabId ? 700 : 500 }}
            >
              {tabId === "login" ? t("auth.loginTab") : t("auth.signupTab")}
              {tab === tabId && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Field icon={Mail} label={t("auth.email")} type="email" placeholder={t("auth.emailPlaceholder")}
                value={loginEmail} onChange={setLoginEmail} />
              <div className="flex flex-col gap-0">
                <Field icon={Lock} label={t("auth.password")} type={showPass ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")} value={loginPass} onChange={setLoginPass}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <PasswordRules password={loginPass} t={t} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading ? <Spinner /> : <><span>{t("auth.loginButton")}</span> <ArrowRight size={15} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <Field icon={User} label={t("auth.fullName")} type="text" placeholder={t("auth.namePlaceholder")}
                value={signupName} onChange={setSignupName} />
              <Field icon={Mail} label={t("auth.uniEmail")} type="email"
                placeholder={t("auth.uniEmailPlaceholder")} value={signupEmail} onChange={setSignupEmail} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("auth.course")}</label>
                <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-accent/60 transition-colors">
                  <BookOpen size={15} className="text-muted-foreground flex-shrink-0" />
                  <select
                    value={signupCourse}
                    onChange={(e) => { setSignupCourse(e.target.value); setSignupOtherCourse(""); }}
                    className="bg-transparent text-sm text-foreground outline-none flex-1 appearance-none dark:[color-scheme:dark]"
                  >
                    <option value="" className="bg-card text-foreground">{t("auth.courseSelect")}</option>
                    {COURSES.map((c) => <option key={c} value={c} className="bg-card text-foreground">{c}</option>)}
                  </select>
                </div>
                {signupCourse === "Outro" && (
                  <input
                    type="text"
                    placeholder={t("auth.courseOtherPlaceholder")}
                    value={signupOtherCourse}
                    onChange={(e) => setSignupOtherCourse(e.target.value)}
                    className="mt-1 w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/60 transition-colors"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0">
                <Field icon={Lock} label={t("auth.password")} type={showPass ? "text" : "password"}
                  placeholder={t("auth.passwordMinPlaceholder")} value={signupPass} onChange={setSignupPass}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <PasswordRules password={signupPass} t={t} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading ? <Spinner /> : <><span>{t("auth.signupButton")}</span> <ArrowRight size={15} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  suffix,
}: {
  icon: typeof Mail;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{label}</label>
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-accent/60 transition-colors">
        <Icon size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
        {suffix}
      </div>
    </div>
  );
}

function PasswordRules({ password, t }: { password: string; t: (k: string) => string }) {
  const rules = [
    { label: t("auth.rule.minChars"), ok: password.length >= 8 },
    { label: t("auth.rule.lowercase"), ok: /[a-z]/.test(password) },
    { label: t("auth.rule.uppercase"), ok: /[A-Z]/.test(password) },
    { label: t("auth.rule.number"), ok: /[0-9]/.test(password) },
    { label: t("auth.rule.special"), ok: /[@#%!$&*^]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {rules.map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          {r.ok
            ? <Check size={13} className="text-emerald-500 flex-shrink-0" />
            : <XIcon size={13} className="text-red-500 flex-shrink-0" />}
          <span className={`text-[11px] ${r.ok ? "text-emerald-600" : "text-red-500"}`}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}
