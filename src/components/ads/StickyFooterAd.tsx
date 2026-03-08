import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdSlot } from "@/hooks/useAdSlots";
import { AdSlot } from "./AdSlot";

export function StickyFooterAd() {
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);
  const slot = useAdSlot("sticky-footer");

  // Delay showing to not block initial render
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !show || !slot) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex-1 flex justify-center">
          <AdSlot slotKey="sticky-footer" page="all" className="max-w-[728px] w-full" />
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          aria-label="Dismiss ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
