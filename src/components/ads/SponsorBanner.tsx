import { useSponsorBanners } from "@/hooks/useAdSlots";
import { useIntersectionTracker } from "@/hooks/useAdTracking";

interface SponsorBannerProps {
  slotKey: string;
  className?: string;
}

export function SponsorBanner({ slotKey, className = "" }: SponsorBannerProps) {
  const { data: banners = [] } = useSponsorBanners(slotKey);
  const { ref, trackClick } = useIntersectionTracker(slotKey);

  if (banners.length === 0) return null;

  return (
    <div ref={ref} className={`${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium mb-2">
        Our Partners
      </p>
      <div className="flex flex-wrap gap-3">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={trackClick}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
          >
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="h-8 w-auto object-contain"
                loading="lazy"
              />
            )}
            <span className="text-sm font-medium">{banner.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
