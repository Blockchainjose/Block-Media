import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PriceChart } from "./PriceChart";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import type { Quote } from "@/hooks/useQuotes";

interface AssetCardProps {
  quote: Quote;
  days?: number;
}

export function AssetCard({ quote, days = 30 }: AssetCardProps) {
  const { data, isLoading } = useHistoricalData(quote.displaySymbol, days);

  const isPositive = quote.change >= 0;

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{quote.displaySymbol}</CardTitle>
          <Badge
            variant="outline"
            className={isPositive ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? "+" : ""}{quote.changePercent.toFixed(2)}%
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{quote.change.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-[150px] w-full" />
        ) : (
          <PriceChart data={data?.candles || []} height={150} showAxis={false} />
        )}
      </CardContent>
    </Card>
  );
}
