import { ExternalLink } from "lucide-react";
import { useSponsorBanners } from "@/hooks/useAdSlots";
import { useIntersectionTracker } from "@/hooks/useAdTracking";

interface SponsorWidgetProps {
  slotKey?: string;
  className?: string;
}

export function SponsorWidget({ slotKey = "sponsor-sidebar-widget", className = "" }: SponsorWidgetProps) {
  const { data: banners = [] } = useSponsorBanners(slotKey);
  const { ref, trackClick } = useIntersectionTracker(slotKey);

  if (banners.length === 0) return null;

  return (
    <div ref={ref} className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium mb-3">
        Recommended Platforms
      </p>
      <div className="space-y-3">
        {banners.slice(0, 4).map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={trackClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            {banner.image_url ? (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {banner.title}
              </p>
              <p className="text-[10px] text-muted-foreground">{banner.label || "Partner"}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
