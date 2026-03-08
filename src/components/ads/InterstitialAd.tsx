import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdSlot } from "@/hooks/useAdSlots";
import { HouseAd } from "./HouseAd";
import { useIntersectionTracker } from "@/hooks/useAdTracking";

const SESSION_KEY = "block-media-interstitial-shown";

export function InterstitialAd() {
  const [show, setShow] = useState(false);
  const slot = useAdSlot("interstitial");
  const { trackClick } = useIntersectionTracker("interstitial");

  useEffect(() => {
    if (!slot || !slot.is_active) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Show after a navigation delay
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2000);

    return () => clearTimeout(timer);
  }, [slot]);

  if (!show || !slot) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full">
        <button
          onClick={() => setShow(false)}
          className="absolute -top-10 right-0 p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground"
          aria-label="Close ad"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="rounded-xl border border-border bg-card p-6" onClick={trackClick}>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium block mb-3">
            Sponsored
          </span>
          {slot.ad_code ? (
            <div dangerouslySetInnerHTML={{ __html: slot.ad_code }} />
          ) : (
            <HouseAd type={slot.fallback_type || "newsletter"} orientation="vertical" />
          )}
        </div>
        <button
          onClick={() => setShow(false)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full text-center"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
