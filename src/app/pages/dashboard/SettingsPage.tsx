import { useState, useRef } from "react";
import {
  User, Lock, Trash2, ShieldCheck, Monitor, Bell,
  Palette, Eye, EyeOff, Smartphone, Mail, MessageSquare,
  AlertTriangle, Sun, Moon, ZoomIn, Contrast,
  LogOut, Wifi, X, Camera,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppSettings, FontSizeOption, ThemeOption, useT } from "../../contexts/AppSettingsContext";
import { compressAvatar } from "../../components/UserAvatar";

function SectionCard({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-accent" />
        </div>
        <div>
          <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-accent" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function PasswordInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          className="w-full px-4 py-3 pr-11 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
        />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ── Confirmation Modal ── */
function ConfirmModal({ title, message, confirmLabel, danger, onConfirm, onCancel }: {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="flex items-start justify-between gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-500/10" : "bg-accent/10"}`}>
            <AlertTriangle size={18} className={danger ? "text-red-500" : "text-accent"} />
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>
        <div>
          <p className="text-base text-foreground" style={{ fontWeight: 700 }}>{title}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm border border-border rounded-xl hover:bg-muted/60 transition-colors" style={{ fontWeight: 600 }}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm rounded-xl transition-colors ${danger ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            style={{ fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_DEVICES = [
  { id: 1, name: "Chrome · Windows", location: "Brasília, DF", time: "Agora", current: true },
  { id: 2, name: "Safari · iPhone 14", location: "Brasília, DF", time: "Há 2 horas", current: false },
  { id: 3, name: "Firefox · MacBook", location: "São Paulo, SP", time: "Ontem", current: false },
];

const TIMEZONES = [
  // América do Sul
  "America/Sao_Paulo (UTC-3)",
  "America/Fortaleza (UTC-3)",
  "America/Belem (UTC-3)",
  "America/Recife (UTC-3)",
  "America/Maceio (UTC-3)",
  "America/Bahia (UTC-3)",
  "America/Manaus (UTC-4)",
  "America/Porto_Velho (UTC-4)",
  "America/Boa_Vista (UTC-4)",
  "America/Cuiaba (UTC-4)",
  "America/Rio_Branco (UTC-5)",
  "America/Eirunepe (UTC-5)",
  "America/Noronha (UTC-2)",
  "America/Buenos_Aires (UTC-3)",
  "America/Santiago (UTC-3)",
  "America/Lima (UTC-5)",
  "America/Bogota (UTC-5)",
  "America/Caracas (UTC-4)",
  "America/La_Paz (UTC-4)",
  "America/Asuncion (UTC-4)",
  "America/Montevideo (UTC-3)",
  "America/Guyana (UTC-4)",
  "America/Paramaribo (UTC-3)",
  "America/Cayenne (UTC-3)",
  // América do Norte e Central
  "America/New_York (UTC-5)",
  "America/Chicago (UTC-6)",
  "America/Denver (UTC-7)",
  "America/Los_Angeles (UTC-8)",
  "America/Anchorage (UTC-9)",
  "Pacific/Honolulu (UTC-10)",
  "America/Toronto (UTC-5)",
  "America/Vancouver (UTC-8)",
  "America/Mexico_City (UTC-6)",
  "America/Cancun (UTC-5)",
  "America/Guatemala (UTC-6)",
  "America/Costa_Rica (UTC-6)",
  "America/Panama (UTC-5)",
  "America/Havana (UTC-5)",
  "America/Puerto_Rico (UTC-4)",
  "America/Santo_Domingo (UTC-4)",
  "America/Jamaica (UTC-5)",
  // Europa
  "Europe/Lisbon (UTC+0)",
  "Europe/London (UTC+0)",
  "Europe/Dublin (UTC+0)",
  "Europe/Madrid (UTC+1)",
  "Europe/Paris (UTC+1)",
  "Europe/Berlin (UTC+1)",
  "Europe/Rome (UTC+1)",
  "Europe/Amsterdam (UTC+1)",
  "Europe/Brussels (UTC+1)",
  "Europe/Vienna (UTC+1)",
  "Europe/Warsaw (UTC+1)",
  "Europe/Prague (UTC+1)",
  "Europe/Budapest (UTC+1)",
  "Europe/Zurich (UTC+1)",
  "Europe/Stockholm (UTC+1)",
  "Europe/Oslo (UTC+1)",
  "Europe/Copenhagen (UTC+1)",
  "Europe/Helsinki (UTC+2)",
  "Europe/Athens (UTC+2)",
  "Europe/Bucharest (UTC+2)",
  "Europe/Sofia (UTC+2)",
  "Europe/Kiev (UTC+2)",
  "Europe/Riga (UTC+2)",
  "Europe/Vilnius (UTC+2)",
  "Europe/Tallinn (UTC+2)",
  "Europe/Moscow (UTC+3)",
  "Europe/Istanbul (UTC+3)",
  "Europe/Minsk (UTC+3)",
  // África
  "Africa/Casablanca (UTC+0)",
  "Africa/Dakar (UTC+0)",
  "Africa/Abidjan (UTC+0)",
  "Africa/Lagos (UTC+1)",
  "Africa/Kinshasa (UTC+1)",
  "Africa/Tunis (UTC+1)",
  "Africa/Algiers (UTC+1)",
  "Africa/Cairo (UTC+2)",
  "Africa/Johannesburg (UTC+2)",
  "Africa/Nairobi (UTC+3)",
  "Africa/Addis_Ababa (UTC+3)",
  "Africa/Dar_es_Salaam (UTC+3)",
  // Ásia / Oriente Médio
  "Asia/Dubai (UTC+4)",
  "Asia/Baku (UTC+4)",
  "Asia/Tbilisi (UTC+4)",
  "Asia/Yerevan (UTC+4)",
  "Asia/Tehran (UTC+3:30)",
  "Asia/Karachi (UTC+5)",
  "Asia/Tashkent (UTC+5)",
  "Asia/Kolkata (UTC+5:30)",
  "Asia/Colombo (UTC+5:30)",
  "Asia/Kathmandu (UTC+5:45)",
  "Asia/Dhaka (UTC+6)",
  "Asia/Almaty (UTC+6)",
  "Asia/Rangoon (UTC+6:30)",
  "Asia/Bangkok (UTC+7)",
  "Asia/Jakarta (UTC+7)",
  "Asia/Ho_Chi_Minh (UTC+7)",
  "Asia/Kuala_Lumpur (UTC+8)",
  "Asia/Singapore (UTC+8)",
  "Asia/Shanghai (UTC+8)",
  "Asia/Hong_Kong (UTC+8)",
  "Asia/Taipei (UTC+8)",
  "Asia/Manila (UTC+8)",
  "Asia/Seoul (UTC+9)",
  "Asia/Tokyo (UTC+9)",
  "Asia/Riyadh (UTC+3)",
  "Asia/Baghdad (UTC+3)",
  "Asia/Beirut (UTC+2)",
  "Asia/Jerusalem (UTC+2)",
  "Asia/Amman (UTC+2)",
  // Oceania
  "Australia/Sydney (UTC+10)",
  "Australia/Melbourne (UTC+10)",
  "Australia/Brisbane (UTC+10)",
  "Australia/Adelaide (UTC+9:30)",
  "Australia/Darwin (UTC+9:30)",
  "Australia/Perth (UTC+8)",
  "Pacific/Auckland (UTC+12)",
  "Pacific/Fiji (UTC+12)",
  "Pacific/Port_Moresby (UTC+10)",
  "Pacific/Guam (UTC+10)",
  // Atlântico / Pacífico
  "Atlantic/Azores (UTC-1)",
  "Atlantic/Cape_Verde (UTC-1)",
  "Atlantic/Reykjavik (UTC+0)",
  "Pacific/Midway (UTC-11)",
  "Pacific/Samoa (UTC-11)",
  "Pacific/Pago_Pago (UTC-11)",
  "Pacific/Tahiti (UTC-10)",
  "Pacific/Marquesas (UTC-9:30)",
  "Pacific/Gambier (UTC-9)",
  "Pacific/Pitcairn (UTC-8)",
  "Pacific/Easter (UTC-6)",
  "Pacific/Tongatapu (UTC+13)",
  "Pacific/Apia (UTC+13)",
];
const LANG_LATIN_NAMES: Record<string, string> = {
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

const LANGUAGES = [
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
const FONT_SIZES: FontSizeOption[] = ["Padrão", "Médio", "Grande", "Muito grande"];

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { highContrast, setHighContrast, fontSize, setFontSize, language, setLanguage, theme, setTheme, translationLoading, translationProgress } = useAppSettings();
  const t = useT();

  /* Dados básicos */
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [displayPhone, setDisplayPhone] = useState(user?.phone ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoUrl ?? null);
  const [basicSaved, setBasicSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Senha */
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* Excluir conta */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  /* 2FA */
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<"sms" | "app">("app");

  /* Dispositivos */
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [deviceToLogout, setDeviceToLogout] = useState<number | null>(null);

  /* Visibilidade */
  const [profileVisibility, setProfileVisibility] = useState<"public" | "private">("public");

  /* Notificações */
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifNews, setNotifNews] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifInteractions, setNotifInteractions] = useState(true);
  const [notifPlant, setNotifPlant] = useState(true);

  /* Exibição */
  const [timezone, setTimezone] = useState("America/Sao_Paulo (UTC-3)");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAvatar(file).then(setAvatarPreview);
    e.target.value = "";
  }

  function saveBasic() {
    const trimmed = displayName.trim();
    const initials = trimmed.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    updateProfile({
      name: trimmed || user?.name,
      avatar: initials || user?.avatar,
      phone: displayPhone.trim(),
      photoUrl: avatarPreview ?? undefined,
    });
    setBasicSaved(true);
    setTimeout(() => setBasicSaved(false), 2500);
  }

  function savePassword() {
    if (!currentPwd) return setPwdMsg({ type: "err", text: t("settings.pwdMissingCurrent") });
    if (newPwd.length < 8) return setPwdMsg({ type: "err", text: t("settings.pwdTooShort") });
    if (newPwd !== confirmPwd) return setPwdMsg({ type: "err", text: t("settings.pwdNoMatch") });
    setPwdMsg({ type: "ok", text: t("settings.pwdChanged") });
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setTimeout(() => setPwdMsg(null), 3000);
  }

  function confirmLogoutDevice(id: number) {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setDeviceToLogout(null);
  }

  function confirmDeleteAccount() {
    setShowDeleteModal(false);
    setAccountDeleted(true);
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-24 md:pb-10" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>

      {/* Modais */}
      {deviceToLogout !== null && (
        <ConfirmModal
          title={t("settings.logoutDeviceTitle")}
          message={`${t("settings.logoutDeviceMsg")} "${devices.find((d) => d.id === deviceToLogout)?.name}"? ${t("settings.logoutDeviceMsg2")}`}
          confirmLabel={t("settings.logoutDevice")}
          onConfirm={() => confirmLogoutDevice(deviceToLogout)}
          onCancel={() => setDeviceToLogout(null)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title={t("settings.deleteModalTitle")}
          message={t("settings.deleteModalMsg")}
          confirmLabel={t("settings.confirmDelete")}
          danger
          onConfirm={confirmDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Dados básicos ── */}
        <SectionCard icon={User} title={t("settings.basicData")} subtitle={t("settings.basicDataSubtitle")}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.profilePhoto")}</label>
              <div className="flex items-center gap-4">
                <div className="relative group flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={t("settings.profilePhoto")} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-accent" style={{ fontWeight: 800 }}>{user.avatar}</span>
                    )}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={18} className="text-white" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-accent border border-accent/30 px-4 py-2 rounded-xl hover:bg-accent/5 transition-colors" style={{ fontWeight: 600 }}>
                    {t("settings.changePhoto")}
                  </button>
                  {avatarPreview && (
                    <button type="button" onClick={() => setAvatarPreview(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {t("settings.removePhoto")}
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.name")}</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.notifEmail")}</label>
              <input type="email" value={user.email} readOnly className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.phone")}</label>
              <input type="tel" value={displayPhone} onChange={(e) => setDisplayPhone(e.target.value)} placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors" />
            </div>
            <button onClick={saveBasic} className={`self-end px-5 py-2.5 text-sm rounded-xl transition-all ${basicSaved ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} style={{ fontWeight: 600 }}>
              {basicSaved ? t("action.saved") : t("settings.saveData")}
            </button>
          </div>
        </SectionCard>

        {/* ── Alterar senha ── */}
        <SectionCard icon={Lock} title={t("settings.changePassword")}>
          <PasswordInput label={t("settings.currentPassword")} value={currentPwd} onChange={setCurrentPwd} />
          <PasswordInput label={t("settings.newPassword")} value={newPwd} onChange={setNewPwd} placeholder={t("settings.minChars")} />
          <PasswordInput label={t("settings.confirmPassword")} value={confirmPwd} onChange={setConfirmPwd} />
          {pwdMsg && (
            <p className={`text-xs px-3 py-2 rounded-lg ${pwdMsg.type === "ok" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
              {pwdMsg.text}
            </p>
          )}
          <button onClick={savePassword} className="self-end px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors" style={{ fontWeight: 600 }}>
            {t("settings.changePassword")}
          </button>
        </SectionCard>

        {/* ── Excluir conta ── */}
        <SectionCard icon={Trash2} title={t("settings.deleteAccount")} subtitle={t("settings.deleteSubtitle")}>
          {accountDeleted ? (
            <p className="text-sm text-muted-foreground text-center py-2 italic">{t("settings.deleteMarked")}</p>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{t("settings.deleteTitle")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.deleteDesc")}</p>
                <button onClick={() => setShowDeleteModal(true)} className="mt-3 text-sm text-red-500 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors" style={{ fontWeight: 600 }}>
                  {t("settings.wantDelete")}
                </button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Segurança e Privacidade ── */}
        <SectionCard icon={ShieldCheck} title={t("settings.security")}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{t("settings.twoFA")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.twoFASubtitle")}</p>
              </div>
              <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} />
            </div>
            {twoFAEnabled && (
              <div className="flex gap-2 pl-1">
                {(["sms", "app"] as const).map((m) => (
                  <button key={m} onClick={() => setTwoFAMethod(m)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${twoFAMethod === m ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`} style={{ fontWeight: twoFAMethod === m ? 600 : 400 }}>
                    {m === "sms" ? <Smartphone size={14} /> : <Monitor size={14} />}
                    {m === "sms" ? t("settings.viaSMS") : t("settings.viaApp")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-border" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Wifi size={14} className="text-muted-foreground" />
              <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{t("settings.connectedDevices")}</p>
            </div>
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-2">{t("settings.noOtherDevices")}</p>
            ) : (
              devices.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 p-3 bg-background border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Monitor size={16} className="text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground leading-tight" style={{ fontWeight: 600 }}>
                        {d.name}{d.current && <span className="text-xs text-accent ml-1">{t("settings.thisDevice")}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{d.location} · {d.time}</p>
                    </div>
                  </div>
                  {!d.current && (
                    <button onClick={() => setDeviceToLogout(d.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 flex-shrink-0 transition-colors" style={{ fontWeight: 600 }}>
                      <LogOut size={13} /> {t("settings.logoutDevice")}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="border-t border-border" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Eye size={14} className="text-muted-foreground" />
              <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{t("settings.profileVisibility")}</p>
            </div>
            <div className="flex gap-2">
              {(["public", "private"] as const).map((v) => (
                <button key={v} onClick={() => setProfileVisibility(v)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all flex-1 justify-center ${profileVisibility === v ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`} style={{ fontWeight: profileVisibility === v ? 600 : 400 }}>
                  {v === "public" ? <Eye size={14} /> : <EyeOff size={14} />}
                  {v === "public" ? t("settings.public") : t("settings.private")}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Notificações ── */}
        <SectionCard icon={Bell} title={t("settings.notifications")}>
          <p className="text-xs text-muted-foreground -mt-1" style={{ fontWeight: 600 }}>{t("settings.channels")}</p>
          {[
            { icon: Mail, labelKey: "settings.notifEmail", state: notifEmail, set: setNotifEmail },
            { icon: Monitor, labelKey: "settings.notifPush", state: notifPush, set: setNotifPush },
            { icon: MessageSquare, labelKey: "settings.notifSMS", state: notifSms, set: setNotifSms },
          ].map(({ icon: Icon, labelKey, state, set }) => (
            <div key={labelKey} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{t(labelKey)}</span>
              </div>
              <Toggle checked={state} onChange={set} />
            </div>
          ))}
          <div className="border-t border-border" />
          <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.alertTypes")}</p>
          {[
            { labelKey: "settings.notifNews", state: notifNews, set: setNotifNews },
            { labelKey: "settings.notifSecurity", state: notifSecurity, set: setNotifSecurity },
            { labelKey: "settings.notifInteractions", state: notifInteractions, set: setNotifInteractions },
            { labelKey: "settings.notifPlant", state: notifPlant, set: setNotifPlant },
          ].map(({ labelKey, state, set }) => (
            <div key={labelKey} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t(labelKey)}</span>
              <Toggle checked={state} onChange={set} />
            </div>
          ))}
        </SectionCard>

        {/* ── Preferências de exibição ── */}
        <SectionCard icon={Palette} title={t("settings.display")}>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.theme")}</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "light" as ThemeOption, labelKey: "settings.themeLight", icon: Sun },
                { value: "dark" as ThemeOption, labelKey: "settings.themeDark", icon: Moon },
              ]).map(({ value, labelKey, icon: Icon }) => (
                <button key={value} onClick={() => setTheme(value)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm border transition-all ${theme === value ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`} style={{ fontWeight: theme === value ? 600 : 400 }}>
                  <Icon size={16} />
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border" />
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.langRegion")}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">{t("settings.language")}</label>
                {translationLoading && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-accent">
                    <span className="inline-block w-2 h-2 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    {Math.round(translationProgress)}%
                  </span>
                )}
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors">
                {LANGUAGES.map((l) => <option key={l} value={l}>{LANG_LATIN_NAMES[l] ? `${l} — ${LANG_LATIN_NAMES[l]}` : l}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">{t("settings.timezone")}</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors">
                {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
              </select>
            </div>
          </div>
          <div className="border-t border-border" />
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("settings.accessibility")}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-1">
                <ZoomIn size={14} className="text-muted-foreground" />
                <label className="text-sm text-foreground">{t("settings.fontSize")}</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { s: "Padrão" as FontSizeOption, lk: "settings.fontDefault" },
                  { s: "Médio" as FontSizeOption, lk: "settings.fontMedium" },
                  { s: "Grande" as FontSizeOption, lk: "settings.fontLarge" },
                  { s: "Muito grande" as FontSizeOption, lk: "settings.fontXLarge" },
                ]).map(({ s, lk }) => (
                  <button key={s} onClick={() => setFontSize(s)} className={`py-2 rounded-xl text-xs border transition-all ${fontSize === s ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`} style={{ fontWeight: fontSize === s ? 600 : 400 }}>
                    {t(lk)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast size={15} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{t("settings.highContrast")}</span>
              </div>
              <Toggle checked={highContrast} onChange={setHighContrast} />
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
