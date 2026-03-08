import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const trackedImpressions = new Set<string>();

export function useAdTracking() {
  const trackEvent = useCallback(
    async (slotKey: string, eventType: "impression" | "click") => {
      // Deduplicate impressions per page load
      const key = `${slotKey}-${eventType}`;
      if (eventType === "impression" && trackedImpressions.has(key)) return;
      if (eventType === "impression") trackedImpressions.add(key);

      try {
        await supabase.from("ad_events").insert({
          slot_key: slotKey,
          event_type: eventType,
          page_url: window.location.pathname,
        });
      } catch {
        // Fail silently — ads should never break the site
      }
    },
    []
  );

  return { trackEvent };
}

export function useIntersectionTracker(slotKey: string) {
  const { trackEvent } = useAdTracking();
  const tracked = useRef(false);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || tracked.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !tracked.current) {
            tracked.current = true;
            trackEvent(slotKey, "impression");
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(node);
    },
    [slotKey, trackEvent]
  );

  return { ref, trackClick: () => trackEvent(slotKey, "click") };
}
