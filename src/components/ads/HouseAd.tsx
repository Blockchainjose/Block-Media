import { Mail, Youtube, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HouseAdProps {
  type: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const houseAds: Record<string, { icon: any; title: string; subtitle: string; cta: string; link: string }> = {
  newsletter: {
    icon: Mail,
    title: "Block Signal",
    subtitle: "Daily market intelligence delivered to your inbox. Free.",
    cta: "Subscribe Now",
    link: "/#newsletter",
  },
  youtube: {
    icon: Youtube,
    title: "Block Media on YouTube",
    subtitle: "Deep dives, market analysis, and expert interviews.",
    cta: "Watch Now",
    link: "https://youtube.com",
  },
  app: {
    icon: Smartphone,
    title: "Block Media Mobile",
    subtitle: "Real-time alerts and news on the go. Coming soon.",
    cta: "Get Notified",
    link: "/#newsletter",
  },
  premium: {
    icon: Sparkles,
    title: "Go Premium",
    subtitle: "Ad-free experience, exclusive analysis, and more.",
    cta: "Learn More",
    link: "/features",
  },
};

export function HouseAd({ type, orientation = "horizontal", className = "" }: HouseAdProps) {
  const ad = houseAds[type] || houseAds.newsletter;
  const Icon = ad.icon;

  if (orientation === "vertical") {
    return (
      <a
        href={ad.link}
        className={`block p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors ${className}`}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-sm">{ad.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{ad.subtitle}</p>
          </div>
          <Button size="sm" className="btn-glow w-full text-xs">
            {ad.cta}
          </Button>
        </div>
      </a>
    );
  }

  return (
    <a
      href={ad.link}
      className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors ${className}`}
    >
      <div className="shrink-0 p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm">{ad.title}</p>
        <p className="text-xs text-muted-foreground truncate">{ad.subtitle}</p>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 text-xs">
        {ad.cta}
      </Button>
    </a>
  );
}
