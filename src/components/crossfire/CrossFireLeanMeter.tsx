interface CrossFireLeanMeterProps {
  leanSpread: { left: number; center: number; right: number };
}

export function CrossFireLeanMeter({ leanSpread }: CrossFireLeanMeterProps) {
  const total = leanSpread.left + leanSpread.center + leanSpread.right;
  if (total === 0) return null;

  const leftPct = (leanSpread.left / total) * 100;
  const centerPct = (leanSpread.center / total) * 100;
  const rightPct = (leanSpread.right / total) * 100;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Coverage Spread
      </p>
      <div className="flex h-3 rounded-full overflow-hidden border border-border">
        {leanSpread.left > 0 && (
          <div
            className="bg-[hsl(var(--bias-left))] transition-all"
            style={{ width: `${leftPct}%` }}
          />
        )}
        {leanSpread.center > 0 && (
          <div
            className="bg-[hsl(var(--bias-center))] transition-all"
            style={{ width: `${centerPct}%` }}
          />
        )}
        {leanSpread.right > 0 && (
          <div
            className="bg-[hsl(var(--bias-right))] transition-all"
            style={{ width: `${rightPct}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-[hsl(var(--bias-left))]">Left ({leanSpread.left})</span>
        <span>Center ({leanSpread.center})</span>
        <span className="text-[hsl(var(--bias-right))]">Right ({leanSpread.right})</span>
      </div>
    </div>
  );
}
