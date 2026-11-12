import { Sprout, Leaf, Wifi, Users, Heart } from "lucide-react";
import { useT } from "../../contexts/AppSettingsContext";

export function SobrePage() {
  const t = useT();

  const cards = [
    { icon: Users, titleKey: "sobre.card1.title", descKey: "sobre.card1.desc" },
    { icon: Wifi,  titleKey: "sobre.card2.title", descKey: "sobre.card2.desc" },
    { icon: Leaf,  titleKey: "sobre.card3.title", descKey: "sobre.card3.desc" },
    { icon: Heart, titleKey: "sobre.card4.title", descKey: "sobre.card4.desc" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="flex flex-col items-center text-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Sprout size={30} className="text-primary-foreground" />
        </div>
        <h1 className="text-3xl sm:text-4xl text-foreground leading-tight" style={{ fontWeight: 800 }}>
          {t("sobre.titlePre")} <span className="text-accent">FalaMangue!</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          {t("sobre.subtitle")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {cards.map(({ icon: Icon, titleKey, descKey }) => (
          <div key={titleKey} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-foreground" style={{ fontWeight: 700 }}>{t(titleKey)}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t(descKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-3xl p-8 text-center flex flex-col items-center gap-4">
        <p className="text-xl text-primary-foreground leading-snug" style={{ fontWeight: 800 }}>
          {t("sobre.quote")}
        </p>
        <p className="text-primary-foreground/60 text-sm max-w-sm">
          {t("sobre.footer")}
        </p>
      </div>
    </div>
  );
}
