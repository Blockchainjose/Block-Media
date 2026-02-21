// Known crypto tickers
const CRYPTO_TICKERS = new Set([
  "$BTC", "$ETH", "$SOL", "$XRP", "$BNB", "$ADA", "$DOGE", "$DOT", "$AVAX",
  "$MATIC", "$LINK", "$UNI", "$AAVE", "$LTC", "$ATOM", "$NEAR", "$APT",
  "$ARB", "$OP", "$SUI", "$FTM", "$ALGO", "$ICP", "$FIL", "$SHIB",
]);

// Known commodity tickers
const COMMODITY_TICKERS = new Set([
  "$GOLD", "$SILVER", "$OIL", "$GAS", "$COPPER", "$PLATINUM", "$WHEAT",
  "$CORN", "$COFFEE", "$SUGAR", "$COTTON", "$USO", "$GLD", "$SLV",
]);

export type MarketCategory = "crypto" | "stocks" | "options" | "commodities" | "forex" | "macro" | "general";

export function getTagColor(tag: string): string {
  const upper = tag.toUpperCase();
  if (CRYPTO_TICKERS.has(upper)) return "hsl(var(--market-crypto))";
  if (COMMODITY_TICKERS.has(upper)) return "hsl(var(--market-commodities))";
  return "hsl(var(--market-stocks))"; // default to stocks blue
}

export function getTagColorClass(tag: string): string {
  const upper = tag.toUpperCase();
  if (CRYPTO_TICKERS.has(upper)) return "bg-[hsl(var(--market-crypto))]/20 text-[hsl(var(--market-crypto))] border-[hsl(var(--market-crypto))]/30";
  if (COMMODITY_TICKERS.has(upper)) return "bg-[hsl(var(--market-commodities))]/20 text-[hsl(var(--market-commodities))] border-[hsl(var(--market-commodities))]/30";
  return "bg-[hsl(var(--market-stocks))]/20 text-[hsl(var(--market-stocks))] border-[hsl(var(--market-stocks))]/30";
}

export function getCategoryLabel(category: MarketCategory): string {
  const labels: Record<MarketCategory, string> = {
    crypto: "🪙 Crypto",
    stocks: "📈 Stocks",
    options: "📊 Options",
    commodities: "🏗️ Commodities",
    forex: "💱 Forex",
    macro: "🌍 Macro",
    general: "💬 General",
  };
  return labels[category];
}

export function getCategoryColorClass(category: MarketCategory): string {
  const classes: Record<MarketCategory, string> = {
    crypto: "border-[hsl(var(--market-crypto))]/50 text-[hsl(var(--market-crypto))]",
    stocks: "border-[hsl(var(--market-stocks))]/50 text-[hsl(var(--market-stocks))]",
    options: "border-[hsl(var(--market-options))]/50 text-[hsl(var(--market-options))]",
    commodities: "border-[hsl(var(--market-commodities))]/50 text-[hsl(var(--market-commodities))]",
    forex: "border-[hsl(var(--market-forex))]/50 text-[hsl(var(--market-forex))]",
    macro: "border-muted-foreground/50 text-muted-foreground",
    general: "border-muted-foreground/50 text-muted-foreground",
  };
  return classes[category];
}

export const BADGE_LABELS: Record<string, { label: string; emoji: string }> = {
  crypto_analyst: { label: "Crypto Analyst", emoji: "🔍" },
  options_trader: { label: "Options Trader", emoji: "📊" },
  top_contributor: { label: "Top Contributor", emoji: "⭐" },
  stock_guru: { label: "Stock Guru", emoji: "📈" },
  commodity_expert: { label: "Commodity Expert", emoji: "🏗️" },
  macro_strategist: { label: "Macro Strategist", emoji: "🌍" },
  first_post: { label: "First Post", emoji: "🎉" },
  popular_post: { label: "Popular Post", emoji: "🔥" },
  veteran: { label: "Veteran", emoji: "🏆" },
};

// Profanity filter (basic)
const PROFANITY_LIST = [
  "fuck", "shit", "ass", "bitch", "damn", "crap", "dick", "pussy",
];
// Trading terms to whitelist
const WHITELIST = ["asset", "position", "short", "long", "bull", "bear", "puts", "calls"];

export function filterProfanity(text: string): string {
  let result = text;
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, "*".repeat(word.length));
  });
  return result;
}

export const ROOM_TABS = [
  { value: "all", label: "All" },
  { value: "general", label: "💬 General" },
  { value: "crypto", label: "🪙 Crypto" },
  { value: "stocks", label: "📈 Stocks" },
  { value: "options", label: "📊 Options" },
  { value: "commodities", label: "🏗️ Commodities" },
  { value: "forex", label: "💱 Forex" },
  { value: "macro", label: "🌍 Macro" },
] as const;
