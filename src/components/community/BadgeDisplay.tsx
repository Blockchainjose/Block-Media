import { BADGE_LABELS } from "@/lib/market-utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeDisplayProps {
  badges: string[];
  maxShow?: number;
}

export function BadgeDisplay({ badges, maxShow = 3 }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {badges.slice(0, maxShow).map(b => {
          const info = BADGE_LABELS[b];
          if (!info) return null;
          return (
            <Tooltip key={b}>
              <TooltipTrigger asChild>
                <span className="text-sm cursor-default">{info.emoji}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{info.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {badges.length > maxShow && (
          <span className="text-xs text-muted-foreground">+{badges.length - maxShow}</span>
        )}
      </div>
    </TooltipProvider>
  );
}
