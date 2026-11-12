import { useState } from "react";
import { User, Mail, BookOpen, Heart, Check, Save, FileText, Lock, Phone } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useT } from "../../contexts/AppSettingsContext";
import { UserAvatar } from "../../components/UserAvatar";

const GENDERS = ["Prefiro não informar", "Masculino", "Feminino", "Não-binário", "Outro"];

const SEXUALITIES = [
  "Prefiro não informar",
  "Heterossexual",
  "Gay",
  "Lésbica",
  "Bissexual",
  "Pansexual",
  "Assexual",
  "Outro",
];

const DISABILITIES = [
  "TDAH",
  "Autismo (TEA)",
  "Dislexia",
  "Discalculia",
  "Deficiência visual",
  "Deficiência auditiva",
  "Deficiência física",
  "Deficiência intelectual",
  "Transtorno de ansiedade",
  "Depressão",
  "Outro transtorno",
];

function SectionCard({ icon: Icon, title, subtitle, locked, children }: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-accent" />
          <div>
            <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {locked && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full flex-shrink-0">
            <Lock size={11} /> Privado
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const t = useT();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [social, setSocial] = useState(user?.social ?? "");
  const [gender, setGender] = useState(() =>
    GENDERS.includes(user?.gender ?? "") ? (user?.gender ?? "") : user?.gender ? "Outro" : ""
  );
  const [genderOther, setGenderOther] = useState(() =>
    user?.gender && !GENDERS.includes(user.gender) ? user.gender : ""
  );
  const [sexuality, setSexuality] = useState(() =>
    SEXUALITIES.includes(user?.sexuality ?? "") ? (user?.sexuality ?? "") : user?.sexuality ? "Outro" : ""
  );
  const [sexualityOther, setSexualityOther] = useState(() =>
    user?.sexuality && !SEXUALITIES.includes(user.sexuality) ? user.sexuality : ""
  );
  const [disabilities, setDisabilities] = useState<string[]>(user?.disabilities ?? []);
  const [disabilityOther, setDisabilityOther] = useState(() => {
    const saved = user?.disabilities ?? [];
    const custom = saved.find((d) => !DISABILITIES.includes(d));
    return custom ?? "";
  });

  function toggleDisability(d: string) {
    setDisabilities((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
    if (d === "Outro transtorno") setDisabilityOther("");
  }

  function handleSave() {
    const trimmed = name.trim();
    const initials = trimmed.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    updateProfile({
      name: trimmed || user?.name,
      avatar: initials || user?.avatar,
      bio: bio.trim(),
      phone: phone.trim(),
      social: social.trim(),
      gender: gender === "Outro" ? genderOther.trim() || "Outro" : gender,
      sexuality: sexuality === "Outro" ? sexualityOther.trim() || "Outro" : sexuality,
      disabilities: disabilities.map((d) =>
        d === "Outro transtorno" && disabilityOther.trim() ? disabilityOther.trim() : d
      ),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-24 md:pb-10" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>{t("profile.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("profile.subtitle")}</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          style={{ fontWeight: 600 }}
        >
          <Save size={14} />
          {saved ? t("action.saved") : t("action.save")}
        </button>
      </div>

      {/* Avatar banner */}
      <div className="bg-primary rounded-2xl p-6 flex items-center gap-5 mb-6">
        <UserAvatar
          user={{ avatar: name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || user.avatar, photoUrl: user.photoUrl }}
          size={64}
          radius="1rem"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xl text-primary-foreground leading-tight truncate" style={{ fontWeight: 800 }}>
            {name || user.name}
          </p>
          <p className="text-sm text-primary-foreground/60 mt-0.5 truncate">{user.course}</p>
          {bio && <p className="text-sm text-primary-foreground/75 mt-2 leading-relaxed line-clamp-2">{bio}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Nome */}
        <SectionCard icon={User} title={t("profile.personalInfo")}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("profile.fullName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.fullName")}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
            />
          </div>
        </SectionCard>

        {/* Bio */}
        <SectionCard icon={FileText} title={t("profile.aboutMe")} subtitle={t("profile.aboutSubtitle")}>
          <div className="flex flex-col gap-1">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder={t("profile.bioPlaceholder")}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </div>
        </SectionCard>

        {/* Contato */}
        <SectionCard icon={Mail} title={t("profile.contact")} subtitle={t("profile.contactSubtitle")}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("profile.email")}</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                <span className="flex items-center gap-1.5"><Phone size={12} /> {t("profile.phone")}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("profile.social")}</label>
              <input
                type="text"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                placeholder="@seu.usuario ou link do perfil"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
              />
            </div>
          </div>
        </SectionCard>

        {/* Formação */}
        <SectionCard icon={BookOpen} title={t("profile.education")}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{t("profile.course")}</label>
            <input
              type="text"
              value={user.course}
              readOnly
              className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground outline-none cursor-not-allowed"
            />
          </div>
        </SectionCard>

        {/* Gênero */}
        <SectionCard icon={Heart} title={t("profile.gender")} locked>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => { setGender(g); if (g !== "Outro") setGenderOther(""); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all text-left ${
                  gender === g
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
                style={{ fontWeight: gender === g ? 600 : 400 }}
              >
                {gender === g && <Check size={13} className="flex-shrink-0" />}
                <span>{g}</span>
              </button>
            ))}
          </div>
          {gender === "Outro" && (
            <input
              type="text"
              value={genderOther}
              onChange={(e) => setGenderOther(e.target.value)}
              placeholder={t("profile.bioPlaceholder")}
              autoFocus
              className="w-full px-4 py-3 bg-background border border-accent/60 rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors"
            />
          )}
        </SectionCard>

        {/* Orientação sexual */}
        <SectionCard icon={Heart} title={t("profile.sexuality")} locked subtitle={t("profile.sexualitySubtitle")}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SEXUALITIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSexuality(s)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all text-left ${
                  sexuality === s
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
                style={{ fontWeight: sexuality === s ? 600 : 400 }}
              >
                {sexuality === s && <Check size={13} className="flex-shrink-0" />}
                <span>{s}</span>
              </button>
            ))}
          </div>
          {sexuality === "Outro" && (
            <input
              type="text"
              value={sexualityOther}
              onChange={(e) => setSexualityOther(e.target.value)}
              placeholder={t("profile.orientationPlaceholder")}
              autoFocus
              className="w-full px-4 py-3 bg-background border border-accent/60 rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors"
            />
          )}
        </SectionCard>

        {/* Deficiências */}
        <SectionCard icon={Heart} title={t("profile.disabilities")} locked subtitle={t("profile.disabilitiesSubtitle")}>
          <div className="grid grid-cols-2 gap-2">
            {DISABILITIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDisability(d)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all text-left ${
                  disabilities.includes(d)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
                style={{ fontWeight: disabilities.includes(d) ? 600 : 400 }}
              >
                {disabilities.includes(d) && <Check size={13} className="flex-shrink-0" />}
                <span className="leading-snug">{d}</span>
              </button>
            ))}
          </div>
          {disabilities.includes("Outro transtorno") && (
            <input
              type="text"
              value={disabilityOther}
              onChange={(e) => setDisabilityOther(e.target.value)}
              placeholder={t("profile.disabilityPlaceholder")}
              autoFocus
              className="w-full px-4 py-3 bg-background border border-accent/60 rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors"
            />
          )}
        </SectionCard>

        {/* Save bottom */}
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl text-sm transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          style={{ fontWeight: 700 }}
        >
          {saved ? t("action.changesSaved") : t("action.saveChanges")}
        </button>
      </div>
    </div>
  );
}
