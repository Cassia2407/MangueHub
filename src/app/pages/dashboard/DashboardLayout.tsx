import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Navigate } from "react-router";
import {
  Bell, ChevronDown, Home, MessageSquare, Leaf, Hammer, Info,
  User, LogOut, Settings, Menu, X, Droplets, Thermometer, Sun, Waves,
  PenLine, Reply, Droplet, RadioTower, Heart, MessageCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useT } from "../../contexts/AppSettingsContext";
import { UserAvatar } from "../../components/UserAvatar";
import { BrandLogo } from "../../components/BrandLogo";
import mangueImg from "../../../imports/out2021mangurzalabre.jpg";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();

  const NAV_ITEMS = [
    { to: "/dashboard", label: t("nav.home"), icon: Home, end: true },
    { to: "/dashboard/forum", label: t("nav.forum"), icon: MessageSquare, end: false },
    { to: "/dashboard/planta", label: t("nav.plant"), icon: Leaf, end: false },
    { to: "/dashboard/making-of", label: t("nav.build"), icon: Hammer, end: false },
    { to: "/dashboard/sobre", label: t("nav.about"), icon: Info, end: false },
  ];
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return <Navigate to="/" replace />;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <BrandLogo />
            <span className="text-lg text-foreground tracking-tight hidden sm:block" style={{ fontWeight: 800 }}>
              FalaMangue!
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
                style={{ fontWeight: 500 }}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2" ref={profileRef}>
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-bold text-foreground">{t("header.notifications")}</p>
                  </div>
                  {[
                    { title: t("header.notif1.title"), time: t("header.notif.time1"), dot: "bg-accent", href: "/dashboard/forum?post=1" },
                    { title: t("header.notif2.title"), time: t("header.notif.time2"), dot: "bg-blue-500", href: "/dashboard/forum?post=2" },
                    { title: t("header.notif3.title"), time: t("header.notif.time3"), dot: "bg-orange-500", href: "/dashboard/planta" },
                    { title: t("header.notif4.title"), time: t("header.notif.time4"), dot: "bg-amber-500", href: "/dashboard/planta" },
                  ].map((n) => (
                    <button
                      key={n.title}
                      onClick={() => { setNotifOpen(false); navigate(n.href); }}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div>
                        <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <UserAvatar user={user} size={32} />
                <div className="hidden sm:block text-left">
                  <p className="text-sm text-foreground leading-none" style={{ fontWeight: 600 }}>
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">{user.course}</p>
                </div>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-background border border-border rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: t("header.profile"), action: () => navigate("/dashboard/perfil") },
                      { icon: Settings, label: t("header.settings"), action: () => navigate("/dashboard/configuracoes") },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors text-left"
                      >
                        <Icon size={15} className="text-muted-foreground" /> {label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> {t("header.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/60 text-foreground"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive ? "bg-accent/15 text-accent" : "text-foreground hover:bg-muted/60"
                  }`
                }
                style={{ fontWeight: 500 }}
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>

      {/* ── Mobile bottom bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-40">
        <div className="grid grid-cols-5 h-16">
          {NAV_ITEMS.slice(0, 5).map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`
              }
            >
              <Icon size={19} />
              <span className="text-[9px]" style={{ fontWeight: 500 }}>{label.split(" ")[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ── Sensor hook (reused in dashboard pages) ──────────────────────────────────

export function useLiveSensorsDash() {
  const [data, setData] = useState({
    humidity: 68, temperature: 28, waterLevel: 42, luminosity: 320,
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

// ── Dashboard Home ────────────────────────────────────────────────────────────



export function DashboardHome() {
  const sensors = useLiveSensorsDash();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [showNewPost, setShowNewPost] = useState(false);
  const [watered, setWatered] = useState(false);

  const hotTopics = [
    { id: 7, title: t("home.hotTopic1.title"), meta: t("home.hotTopic1.meta"), course: t("home.hotTopic1.course") },
    { id: 8, title: t("home.hotTopic2.title"), meta: t("home.hotTopic2.meta"), course: t("home.hotTopic2.course") },
    { id: 9, title: t("home.hotTopic3.title"), meta: t("home.hotTopic3.meta"), course: t("home.hotTopic3.course") },
  ];

  const recentPosts = [
    { id: 1, author: "João Victor", course: "Eng. Ambiental", time: t("home.recentPost1.time"), title: t("home.recentPost1.title"), tags: [t("home.recentPost1.tag1"), t("home.recentPost1.tag2")], likes: 24, replies: 8, avatar: "JV" },
    { id: 2, author: "Beatriz Lima", course: "Biologia Marinha", time: t("home.recentPost2.time"), title: t("home.recentPost2.title"), tags: [t("home.recentPost2.tag1"), t("home.recentPost2.tag2")], likes: 56, replies: 12, avatar: "BL" },
  ];

  function handleWater() {
    setWatered(true);
    setTimeout(() => setWatered(false), 3000);
  }

  const sensorCards = [
    { icon: Droplets, label: t("plant.humidity"), value: `${sensors.humidity.toFixed(0)}%`, color: "bg-blue-500" },
    { icon: Waves, label: t("plant.waterLevel"), value: `${sensors.waterLevel.toFixed(0)} cm`, color: "bg-cyan-500" },
    { icon: Thermometer, label: t("plant.temperature"), value: `${sensors.temperature.toFixed(0)}°C`, color: "bg-orange-500" },
    { icon: Sun, label: t("plant.sunlight"), value: `${sensors.luminosity.toFixed(0)} lux`, color: "bg-amber-500" },
  ];
  const quick = [
    { label: t("home.newPost"), icon: PenLine, action: () => setShowNewPost(true), color: "bg-accent/15 text-accent" },
    { label: t("home.replies"), icon: Reply, action: () => navigate("/dashboard/forum"), color: "bg-blue-500/15 text-blue-600" },
    { label: watered ? t("home.watered") : t("home.waterPlant"), icon: Droplet, action: handleWater, color: watered ? "bg-emerald-500/20 text-emerald-600" : "bg-cyan-500/15 text-cyan-600" },
    { label: t("home.sensors"), icon: RadioTower, action: () => navigate("/dashboard/planta"), color: "bg-orange-500/15 text-orange-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>
          {t("home.greeting")}, {user?.name.split(" ")[0]}! 🌱
        </h1>
        <p className="text-muted-foreground mt-1">{t("home.welcome")} 🌱</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Sensor mini-cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>Sensores IoT · ao vivo</p>
              <span className="flex items-center gap-1.5 text-[11px] text-accent" style={{ fontWeight: 600 }}>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> AO VIVO
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sensorCards.map((c) => (
                <div key={c.label} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                    <c.icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{c.label}</p>
                    <p className="text-lg text-foreground" style={{ fontWeight: 700, fontFamily: "DM Mono, monospace" }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plant card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-32 sm:h-40">
              <img src={mangueImg} alt="Planta" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-emerald-600 bg-white px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Saudável
              </span>
              <p className="absolute bottom-3 left-4 text-white text-sm" style={{ fontWeight: 700 }}>Mangue Vermelho #027</p>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{t("plant.growth")}</span>
                <span className="text-accent" style={{ fontWeight: 700 }}>78% · 1,25 m</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <p className="text-sm text-foreground mb-3" style={{ fontWeight: 600 }}>{t("home.quickActions")}</p>
            <div className="grid grid-cols-4 gap-3">
              {quick.map(({ label, icon: Icon, action, color }) => (
                <button key={label} onClick={action} className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 border border-border shadow-sm hover:border-accent/40 hover:shadow-md transition-all active:scale-95">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs text-foreground text-center leading-tight" style={{ fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent posts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{t("home.recentPosts")}</p>
              <NavLink to="/dashboard/forum" className="text-sm text-accent" style={{ fontWeight: 500 }}>{t("home.viewForum")}</NavLink>
            </div>
            <div className="flex flex-col gap-3">
              {recentPosts.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-accent/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-primary-foreground" style={{ fontWeight: 700 }}>{p.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{p.author}</p>
                      <p className="text-xs text-muted-foreground">{p.course} · {p.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-3 leading-snug" style={{ fontWeight: 600 }}>{p.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {p.tags.map((t) => <span key={t} className="text-xs text-accent bg-accent/10 px-2.5 py-0.5 rounded-full" style={{ fontWeight: 500 }}>#{t}</span>)}
                    </div>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Heart size={12} /> {p.likes}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle size={12} /> {p.replies}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Pontos */}
          <div className="bg-primary rounded-2xl p-5 shadow-sm flex flex-col gap-2">
            <p className="text-primary-foreground/60 text-xs">{t("home.yourPoints")}</p>
            <p className="text-primary-foreground" style={{ fontWeight: 800, fontSize: "2.25rem", fontFamily: "DM Mono, monospace" }}>2.450</p>
            <p className="text-sm text-accent">{t("home.pointsThisWeek")}</p>
          </div>

          {/* Tópicos em alta */}
          <div>
            <p className="text-sm text-foreground mb-3" style={{ fontWeight: 600 }}>{t("home.hotTopics")}</p>
            <div className="flex flex-col gap-2">
              {hotTopics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/dashboard/forum?post=${t.id}`)}
                  className="bg-card rounded-xl border border-border p-3.5 shadow-sm hover:border-accent/30 hover:shadow-md transition-all text-left w-full group"
                >
                  <p className="text-sm text-foreground leading-snug mb-1.5 group-hover:text-accent transition-colors" style={{ fontWeight: 600 }}>{t.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-accent">{t.course}</span>
                    <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                    <span className="text-xs text-muted-foreground">{t.meta}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New post modal */}
      {showNewPost && (
        <QuickPostModal user={user} onClose={() => setShowNewPost(false)} onSubmit={() => { setShowNewPost(false); navigate("/dashboard/forum"); }} />
      )}
    </div>
  );
}

function QuickPostModal({ user, onClose, onSubmit }: { user: { name: string; avatar: string } | null; onClose: () => void; onSubmit: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const canPost = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-base text-foreground" style={{ fontWeight: 700 }}>Nova postagem</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-muted/60 flex items-center justify-center text-muted-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={40} />
            <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{user?.name}</p>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da postagem"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/60 transition-colors"
            style={{ fontWeight: 600 }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compartilhe suas ideias com a comunidade..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-accent/60 transition-colors"
          />
          <div className="flex items-center justify-end gap-3 pt-1 border-t border-border">
            <button onClick={onClose} className="px-4 py-2.5 text-sm text-foreground rounded-xl border border-border hover:bg-muted/60 transition-colors">
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={!canPost}
              className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <PenLine size={14} /> Publicar no fórum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
