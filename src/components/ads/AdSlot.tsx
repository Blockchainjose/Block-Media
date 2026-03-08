import { useEffect, useRef, useState, memo } from "react";
import { useAdSlot, type AdSlot as AdSlotType } from "@/hooks/useAdSlots";
import { useIntersectionTracker } from "@/hooks/useAdTracking";
import { HouseAd } from "./HouseAd";

interface AdSlotProps {
  slotKey: string;
  className?: string;
  fallbackOrientation?: "horizontal" | "vertical";
  /** Override display check for specific page context */
  page?: string;
}

/** Max visible ads on screen at once — enforced via CSS-level containment */
const AD_LABEL_CLASSES = "text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium";

function AdSlotInner({ slotKey, className = "", fallbackOrientation = "horizontal", page }: AdSlotProps) {
  const slot = useAdSlot(slotKey);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { ref: trackRef, trackClick } = useIntersectionTracker(slotKey);

  // Lazy load: only render ad content when near viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Check display rules
  if (slot && !shouldDisplay(slot, page)) return null;
  if (!slot) return null;

  const hasCustomCode = slot.ad_code && slot.ad_code.trim().length > 0;

  return (
    <div
      ref={(node) => {
        (containerRef as any).current = node;
        trackRef(node);
      }}
      className={`ad-slot relative ${className}`}
      style={{ minHeight: getMinHeight(slot) }}
      onClick={trackClick}
    >
      <span className={`block mb-1 ${AD_LABEL_CLASSES}`}>
        {slot.slot_type === "sponsor" ? "Sponsored" : "Ad"}
      </span>

      {isVisible ? (
        hasCustomCode ? (
          <CustomAdRenderer code={slot.ad_code!} />
        ) : (
          <HouseAd
            type={slot.fallback_type || "newsletter"}
            orientation={fallbackOrientation}
          />
        )
      ) : (
        <div className="bg-card/50 rounded-lg animate-pulse" style={{ minHeight: getMinHeight(slot) }} />
      )}
    </div>
  );
}

export const AdSlot = memo(AdSlotInner);

function CustomAdRenderer({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const container = containerRef.current;
    container.innerHTML = code;

    // Execute any script tags in the ad code
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    return () => {
      container.innerHTML = "";
    };
  }, [code]);

  return <div ref={containerRef} className="ad-custom-container" />;
}

function shouldDisplay(slot: AdSlotType, page?: string): boolean {
  const rules = slot.display_rules || {};

  // Device check
  if (rules.device === "desktop" && window.innerWidth < 768) return false;
  if (rules.device === "mobile" && window.innerWidth >= 768) return false;

  // Page check
  if (page && rules.pages && rules.pages !== "all") {
    const allowedPages = (rules.pages as string).split(",");
    if (!allowedPages.includes(page)) return false;
  }

  return true;
}

function getMinHeight(slot: AdSlotType): string {
  const isMobile = window.innerWidth < 768;
  const size = isMobile ? slot.size_mobile : slot.size_desktop;
  if (!size || size === "responsive") return "90px";
  const height = size.split("x")[1];
  return height ? `${height}px` : "90px";
}
