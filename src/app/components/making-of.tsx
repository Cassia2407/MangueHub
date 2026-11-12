import React from "react";
import fotoRobo from "../../imports/WhatsApp_Image_2026-07-23_at_17.07.34.jpeg";
import fotoCircuito from "../../imports/WhatsApp_Image_2026-07-23_at_17.06.46.jpeg";
import fotoSensores from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.05.jpeg";
import foto08_30 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.30.jpeg";
import foto08_30_2 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.30__2_.jpeg";
import foto08_30_1 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.30__1_.jpeg";
import foto08_29 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.29.jpeg";
import foto08_22 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.22.jpeg";
import foto08_22_1 from "../../imports/WhatsApp_Image_2026-07-23_at_17.08.22__1_.jpeg";
import fotoSensorLED from "../../imports/Captura_de_tela_2026-07-24_152629.png";
import fotoSensorTemp from "../../imports/Captura_de_tela_2026-07-24_152945.png";
import fotoSensorUmidade from "../../imports/Captura_de_tela_2026-07-24_153123.png";
import fotoSensorUmidade2 from "../../imports/Captura_de_tela_2026-07-24_153559.png";
import fotoMatrizLED from "../../imports/Captura_de_tela_2026-07-24_153903.png";
import fotoSamantha from "../../imports/image.png";
import fotoArnott from "../../imports/image-1.png";
import fotoJamile from "../../imports/image-2.png";
import fotoJulia from "../../imports/WhatsApp_Image_2026-07-24_at_17.42.36.jpeg";
import fotoEquipe from "../../imports/WhatsApp_Image_2026-09-01_at_22.53.57.jpeg";
import { BrandLogo } from "./BrandLogo";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Figma as FigmaIcon,
  Cog,
  Cpu,
  FlaskConical,
  Rocket,
  Github,
  Linkedin,
  Code2,
  Terminal,
  MessageSquareCode,
  Wind,
  Component,
  FileCode2,
  CircuitBoard,
  Wifi,
  CalendarDays,
  Clock,
  GitCommit,
  LayoutTemplate,
  MonitorSmartphone,
  Users,
  GitPullRequest,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { useT } from "../contexts/AppSettingsContext";
import { SettingsPopover } from "./SettingsPopover";

// ─── Shared ─────────────────────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
      {children}
    </span>
  );
}

function SectionHeader({
  tag,
  title,
  desc,
  center = true,
}: {
  tag: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 mb-10 ${center ? "items-center text-center" : "items-start"}`}>
      <Badge>{tag}</Badge>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground" style={{ fontWeight: 800 }}>
        {title}
      </h2>
      {desc && <p className="text-muted-foreground max-w-xl leading-relaxed">{desc}</p>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────────

export function MakingOf({ onBack }: { onBack: () => void }) {
  const t = useT();

  // All data arrays defined inside the component to access t()
  const timeline = [
    { icon: Lightbulb, emoji: "💡", date: "Dia 1 · 20 jul", title: t("makingOf.timeline.item1.title"), desc: t("makingOf.timeline.item1.desc"), img: fotoRobo },
    { icon: BookOpen, emoji: "📖", date: "Dia 1 · 20 jul", title: t("makingOf.timeline.item2.title"), desc: t("makingOf.timeline.item2.desc"), img: fotoCircuito },
    { icon: FigmaIcon, emoji: "🎨", date: "Dia 3 · 22 jul", title: t("makingOf.timeline.item3.title"), desc: t("makingOf.timeline.item3.desc"), img: fotoSensores },
    { icon: Cog, emoji: "🔧", date: "Dias 2–4 · 21–23 jul", title: t("makingOf.timeline.item4.title"), desc: t("makingOf.timeline.item4.desc"), img: foto08_30 },
    { icon: FlaskConical, emoji: "🧪", date: "Dia 3 · 22 jul", title: t("makingOf.timeline.item5.title"), desc: t("makingOf.timeline.item5.desc"), img: foto08_29 },
    { icon: CircuitBoard, emoji: "⚙️", date: "Dia 4 · 23 jul", title: t("makingOf.timeline.item6.title"), desc: t("makingOf.timeline.item6.desc"), img: foto08_22 },
    { icon: Rocket, emoji: "🚀", date: "Dia 5 · 24 jul", title: t("makingOf.timeline.item7.title"), desc: t("makingOf.timeline.item7.desc"), img: foto08_22_1 },
  ];

  const gallery = [
    { caption: t("makingOf.gallery.caption1"), date: "Jul 2026", img: foto08_30, span: "sm:row-span-2" },
    { caption: t("makingOf.gallery.caption2"), date: "Jul 2026", img: fotoCircuito, span: "" },
    { caption: t("makingOf.gallery.caption3"), date: "Jul 2026", img: fotoRobo, span: "" },
    { caption: t("makingOf.gallery.caption4"), date: "Jul 2026", img: foto08_30_1, span: "sm:col-span-2" },
    { caption: t("makingOf.gallery.caption5"), date: "Jul 2026", img: foto08_30_2, span: "sm:row-span-2" },
    { caption: t("makingOf.gallery.caption6"), date: "Jul 2026", img: fotoSensores, span: "" },
    { caption: t("makingOf.gallery.caption7"), date: "Jul 2026", img: foto08_29, span: "" },
    { caption: t("makingOf.gallery.caption8"), date: "Jul 2026", img: foto08_22, span: "" },
    { caption: t("makingOf.gallery.caption9"), date: "Jul 2026", img: foto08_22_1, span: "" },
  ];

  const tools = [
    { icon: FigmaIcon, name: "Figma", desc: t("makingOf.tools.figmaDesc"), use: t("makingOf.tools.figmaUse"), color: "text-pink-500 bg-pink-50" },
    { icon: Code2, name: "VS Code", desc: t("makingOf.tools.vscodeDesc"), use: t("makingOf.tools.vscodeUse"), color: "text-blue-500 bg-blue-50" },
    { icon: Github, name: "GitHub", desc: t("makingOf.tools.githubDesc"), use: t("makingOf.tools.githubUse"), color: "text-gray-800 bg-gray-100" },
    { icon: Terminal, name: "Arduino IDE", desc: t("makingOf.tools.arduinoDesc"), use: t("makingOf.tools.arduinoUse"), color: "text-teal-600 bg-teal-50" },
    { icon: CircuitBoard, name: "ESP32", desc: t("makingOf.tools.esp32Desc"), use: t("makingOf.tools.esp32Use"), color: "text-red-500 bg-red-50" },
    { icon: MessageSquareCode, name: "ChatGPT", desc: t("makingOf.tools.chatgptDesc"), use: t("makingOf.tools.chatgptUse"), color: "text-emerald-600 bg-emerald-50" },
  ];

  const challenges = [
    { problem: t("makingOf.challenges.item1.problem"), solution: t("makingOf.challenges.item1.solution"), learn: t("makingOf.challenges.item1.learn") },
    { problem: t("makingOf.challenges.item2.problem"), solution: t("makingOf.challenges.item2.solution"), learn: t("makingOf.challenges.item2.learn") },
    { problem: t("makingOf.challenges.item3.problem"), solution: t("makingOf.challenges.item3.solution"), learn: t("makingOf.challenges.item3.learn") },
    { problem: t("makingOf.challenges.item4.problem"), solution: t("makingOf.challenges.item4.solution"), learn: t("makingOf.challenges.item4.learn") },
    { problem: t("makingOf.challenges.item5.problem"), solution: t("makingOf.challenges.item5.solution"), learn: t("makingOf.challenges.item5.learn") },
  ];

  const team = [
    { name: "Arnott Ramos Caiado", role: t("makingOf.team.member1.role"), bio: t("makingOf.team.member1.bio"), tasks: [t("makingOf.team.member1.task1"), t("makingOf.team.member1.task2")], initials: "AR", photo: fotoArnott },
    { name: "Samantha Pimentel",   role: t("makingOf.team.member2.role"), bio: t("makingOf.team.member2.bio"), tasks: [t("makingOf.team.member2.task1"), t("makingOf.team.member2.task2")], initials: "SP", photo: fotoSamantha },
    { name: "Jamile Keiller",      role: t("makingOf.team.member3.role"), bio: t("makingOf.team.member3.bio"), tasks: [t("makingOf.team.member3.task1"), t("makingOf.team.member3.task2")], initials: "JK", photo: fotoJamile },
    { name: "Júlia Cássia",        role: t("makingOf.team.member4.role"), bio: t("makingOf.team.member4.bio"), tasks: [t("makingOf.team.member4.task1"), t("makingOf.team.member4.task2")], initials: "JC", photo: fotoJulia },
  ];

  const stats = [
    { icon: CalendarDays, value: "5",      label: t("makingOf.stats.label1"), color: "bg-amber-400/20 text-amber-300",   num: "text-amber-300" },
    { icon: Clock,        value: "30h",    label: t("makingOf.stats.label2"), color: "bg-sky-400/20 text-sky-300",       num: "text-sky-300" },
    { icon: GitCommit,    value: "—",      label: t("makingOf.stats.label3"), color: "bg-violet-400/20 text-violet-300", num: "text-violet-300" },
    { icon: LayoutTemplate, value: "3",   label: t("makingOf.stats.label4"), color: "bg-rose-400/20 text-rose-300",     num: "text-rose-300" },
    { icon: Code2,        value: "~1.480", label: t("makingOf.stats.label5"), color: "bg-emerald-400/20 text-emerald-300", num: "text-emerald-300" },
    { icon: MonitorSmartphone, value: "4", label: t("makingOf.stats.label6"), color: "bg-orange-400/20 text-orange-300", num: "text-orange-300" },
    { icon: Users,        value: "5",      label: t("makingOf.stats.label7"), color: "bg-cyan-400/20 text-cyan-300",     num: "text-cyan-300" },
    { icon: GitPullRequest, value: "3",   label: t("makingOf.stats.label8"), color: "bg-pink-400/20 text-pink-300",     num: "text-pink-300" },
  ];

  const codePhotos = [
    { src: fotoSensorLED, label: t("makingOf.code.sensorLabel") },
    { src: fotoSensorTemp, label: t("makingOf.code.tempLabel") },
    { src: fotoSensorUmidade, label: t("makingOf.code.humLabel") },
    { src: fotoSensorUmidade2, label: t("makingOf.code.distLabel") },
    { src: fotoMatrizLED, label: t("makingOf.code.matrixLabel") },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> {t("makingOf.back")}
          </button>
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="text-lg text-foreground tracking-tight" style={{ fontWeight: 800 }}>FalaMangue!</span>
          </div>
          <SettingsPopover />
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-32 pb-14 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center gap-5 mb-10">
          <Badge>{t("makingOf.badge")}</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight max-w-3xl" style={{ fontWeight: 800 }}>
            {t("makingOf.heroTitlePre")} <span className="text-accent">FalaMangue!</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t("makingOf.heroDesc")}
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 aspect-[16/7]">
          <img
            src={fotoEquipe}
            alt="Foto da equipe FalaMangue!"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.timeline.badge")} title={t("makingOf.timeline.title")} desc={t("makingOf.timeline.desc")} />

          {/* Desktop horizontal */}
          <div className="hidden lg:block relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
            <div className="grid grid-cols-7 gap-3">
              {timeline.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center relative z-10 mb-4">
                    <item.icon size={20} />
                  </div>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm w-full">
                    <img src={item.img} alt={item.title} className="w-full h-20 object-cover" />
                    <div className="p-3 flex flex-col gap-1">
                      <span className="text-[10px] text-accent" style={{ fontWeight: 600 }}>{item.date}</span>
                      <p className="text-xs text-foreground leading-snug" style={{ fontWeight: 700 }}>{item.emoji} {item.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile / tablet vertical */}
          <div className="lg:hidden relative pl-10">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-border" />
            <div className="flex flex-col gap-6">
              {timeline.map((item) => (
                <div key={item.title} className="relative">
                  <div className="absolute -left-10 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <item.icon size={16} />
                  </div>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <img src={item.img} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-accent" style={{ fontWeight: 600 }}>{item.date}</span>
                      <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{item.emoji} {item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.gallery.badge")} title={t("makingOf.gallery.title")} desc={t("makingOf.gallery.desc")} />
          <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] gap-3">
            {gallery.map((g) => (
              <div key={g.caption} className={`relative rounded-2xl overflow-hidden group ${g.span}`}>
                <img src={g.img} alt={g.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs leading-snug" style={{ fontWeight: 600 }}>{g.caption}</p>
                  <p className="text-white/70 text-[10px]">{g.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.tools.badge")} title={t("makingOf.tools.title")} desc={t("makingOf.tools.desc")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((item) => (
              <div key={item.name} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-foreground" style={{ fontWeight: 700 }}>{item.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full self-start" style={{ fontWeight: 600 }}>{item.use}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code behind the scenes ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.code.badge")} title={t("makingOf.code.title")} desc={t("makingOf.code.desc")} />
          <div className="grid md:grid-cols-2 gap-4">
            {codePhotos.map((photo) => (
              <div key={photo.label} className="rounded-2xl overflow-hidden border border-border shadow-sm bg-[#0f1f17] flex flex-col">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[11px] text-white/60 flex items-center gap-1.5" style={{ fontFamily: "DM Mono, monospace" }}>
                    <FileCode2 size={12} /> hardware
                  </span>
                  <span className="ml-auto text-[9px] text-accent uppercase tracking-wide">{t("makingOf.code.photoTag")}</span>
                </div>
                <img src={photo.src} alt={photo.label} className="w-full object-contain" />
                <div className="px-4 py-3 border-t border-white/10">
                  <p className="text-[11px] text-white/50 leading-relaxed">{photo.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Challenges ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.challenges.badge")} title={t("makingOf.challenges.title")} desc={t("makingOf.challenges.desc")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <div key={c.problem} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-red-500 uppercase tracking-wide" style={{ fontWeight: 700 }}>{t("makingOf.challenges.problemLabel")}</span>
                  <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{c.problem}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-blue-500 uppercase tracking-wide" style={{ fontWeight: 700 }}>{t("makingOf.challenges.solutionLabel")}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.solution}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                  <p className="text-xs text-accent" style={{ fontWeight: 600 }}>{c.learn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag={t("makingOf.team.badge")} title={t("makingOf.team.title")} desc={t("makingOf.team.desc")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((m) => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center overflow-hidden">
                  {m.photo
                    ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    : <span className="text-lg text-primary-foreground" style={{ fontWeight: 700 }}>{m.initials}</span>
                  }
                </div>
                <div>
                  <p className="text-foreground" style={{ fontWeight: 700 }}>{m.name}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
                  <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={15} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-10">
            <Badge>{t("makingOf.stats.badge")}</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl" style={{ fontWeight: 800 }}>{t("makingOf.stats.title")}</h2>
            <p className="text-primary-foreground/70 max-w-xl">{t("makingOf.stats.desc")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-black/40 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <p className={`text-3xl ${s.num}`} style={{ fontWeight: 800, fontFamily: "DM Mono, monospace" }}>{s.value}</p>
                <p className="text-xs text-primary-foreground/60 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our journey ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0f1f17] text-white">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <Sprout size={26} className="text-white" />
          </div>
          <Badge>{t("makingOf.journey.badge")}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight" style={{ fontWeight: 800 }}>
            {t("makingOf.journey.title")}
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            {t("makingOf.journey.desc")}
          </p>
          <button onClick={onBack} className="mt-2 px-6 py-3 bg-accent text-accent-foreground rounded-2xl text-sm flex items-center gap-2 hover:bg-accent/90 transition-colors" style={{ fontWeight: 600 }}>
            {t("makingOf.journey.back")} <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
