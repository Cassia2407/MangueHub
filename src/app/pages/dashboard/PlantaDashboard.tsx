import { Droplets, Waves, Thermometer, Sun, Signal, Wifi, BatteryCharging, ArrowRight } from "lucide-react";
import { useLiveSensorsDash } from "./DashboardLayout";
import { useT } from "../../contexts/AppSettingsContext";
import mangueImg from "../../../imports/out2021mangurzalabre.jpg";
import plantExpressionsImg from "../../../imports/Captura_de_tela_2026-09-01_115443.png";
import mangue027Img from "../../../imports/images.jpg";

export function PlantaDashboard() {
  const sensors = useLiveSensorsDash();
  const t = useT();
  const cards = [
    { icon: Droplets, label: t("plant.humidity"), value: `${sensors.humidity.toFixed(0)}%`, color: "bg-blue-500" },
    { icon: Waves, label: t("plant.waterLevel"), value: `${sensors.waterLevel.toFixed(0)} cm`, color: "bg-cyan-500" },
    { icon: Thermometer, label: t("plant.temperature"), value: `${sensors.temperature.toFixed(0)}°C`, color: "bg-orange-500" },
    { icon: Sun, label: t("plant.sunlight"), value: `${sensors.luminosity.toFixed(0)} lux`, color: "bg-amber-500" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>{t("plant.title")}</h1>
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> {t("plant.connected")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Signal size={18} />
          <Wifi size={18} />
          <BatteryCharging size={18} className="text-accent" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Plant image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: "280px" }}>
          <img src={mangue027Img} alt="Mangue Vermelho #027" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-white bg-red-500/90 px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> {t("plant.live")}
          </span>
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm" style={{ fontWeight: 700 }}>{t("plant.camera")}</p>
            <p className="text-white/60 text-xs mt-0.5">{t("plant.lastUpdate")}</p>
          </div>
        </div>

        {/* Sensor cards */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {cards.map((c) => (
            <div key={c.label} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
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

      {/* Growth */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base text-foreground" style={{ fontWeight: 600 }}>{t("plant.growth")}</p>
          <span className="text-base text-accent" style={{ fontWeight: 700 }}>1,25 m · 78%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: "78%" }} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Meta: 1,60 m · estimativa de 4 meses</p>
      </div>

      {/* Expressions */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-6 pt-5 pb-2">
          <p className="text-base text-foreground" style={{ fontWeight: 700 }}>{t("plant.howReacts")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("plant.ledDesc")}</p>
        </div>
        <img src={plantExpressionsImg} alt="Expressões da planta — Matriz LED 8x8" className="w-full object-contain" />
      </div>
    </div>
  );
}
