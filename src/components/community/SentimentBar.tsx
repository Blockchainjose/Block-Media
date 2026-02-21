import { TrendingUp, TrendingDown } from "lucide-react";

interface SentimentBarProps {
  bullishPercent: number;
  bearishPercent: number;
}

export function SentimentBar({ bullishPercent, bearishPercent }: SentimentBarProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <p className="text-sm font-medium mb-3 text-muted-foreground">Community Sentiment</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-bold">{bullishPercent}%</span>
        </div>
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-red-500/30">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${bullishPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <span className="text-sm font-bold">{bearishPercent}%</span>
          <TrendingDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
