import { useQuotes, type Quote } from "@/hooks/useQuotes";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatPrice(price: number, symbol: string): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toFixed(2);
  }
  return price.toFixed(4);
}

function QuoteItem({ quote }: { quote: Quote }) {
  const isPositive = quote.change > 0;
  const isNegative = quote.change < 0;
  const isNeutral = quote.change === 0;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 whitespace-nowrap">
      <span className="text-xs font-medium text-muted-foreground">
        {quote.displaySymbol}
      </span>
      <span className="text-xs font-mono text-foreground">
        ${formatPrice(quote.price, quote.symbol)}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-[10px] font-medium",
          isPositive && "text-bias-left",
          isNegative && "text-primary",
          isNeutral && "text-muted-foreground"
        )}
      >
        {isPositive && <TrendingUp className="w-2.5 h-2.5" />}
        {isNegative && <TrendingDown className="w-2.5 h-2.5" />}
        {isNeutral && <Minus className="w-2.5 h-2.5" />}
        {Math.abs(quote.changePercent).toFixed(2)}%
      </span>
    </div>
  );
}

function TickerSkeleton() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1">
      <div className="h-3 w-8 bg-muted rounded animate-pulse" />
      <div className="h-3 w-14 bg-muted rounded animate-pulse" />
      <div className="h-3 w-10 bg-muted rounded animate-pulse" />
    </div>
  );
}

export function PriceTicker() {
  const { data: quotes, isLoading, error } = useQuotes();

  if (error) {
    return null;
  }

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="overflow-hidden">
        <div className="flex items-center ticker-scroll">
          {isLoading ? (
            Array.from({ length: 13 }).map((_, i) => (
              <TickerSkeleton key={i} />
            ))
          ) : (
            <>
              {quotes?.map((quote) => (
                <QuoteItem key={quote.symbol} quote={quote} />
              ))}
              <div className="w-px h-3 bg-border mx-2" />
              {quotes?.map((quote) => (
                <QuoteItem key={`${quote.symbol}-dup`} quote={quote} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
