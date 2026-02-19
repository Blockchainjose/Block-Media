import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://blockmediacorp.com",
  "https://orbit-news-feed.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// IP-based rate limiting: 60 requests per minute
const ipRateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || now > entry.reset) {
    ipRateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

interface Quote {
  symbol: string;
  displaySymbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const INDEX_SYMBOLS = ["SPY", "QQQ", "DIA"];
const STOCK_SYMBOLS = ["PLTR", "CRWV", "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"];
const CRYPTO_SYMBOLS = ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT", "BINANCE:XRPUSDT", "BINANCE:BNBUSDT"];
const COMMODITY_SYMBOLS = ["GLD", "SLV", "PPLT", "USO", "CPER"];

const DISPLAY_NAMES: Record<string, string> = {
  "SPY": "S&P 500", "QQQ": "NASDAQ", "DIA": "DOW",
  "PLTR": "PLTR", "CRWV": "CRWV", "AAPL": "AAPL", "MSFT": "MSFT",
  "GOOGL": "GOOGL", "AMZN": "AMZN", "NVDA": "NVDA", "META": "META", "TSLA": "TSLA",
  "BINANCE:BTCUSDT": "BTC", "BINANCE:ETHUSDT": "ETH", "BINANCE:SOLUSDT": "SOL",
  "BINANCE:XRPUSDT": "XRP", "BINANCE:BNBUSDT": "BNB",
  "GLD": "Gold", "SLV": "Silver", "PPLT": "Platinum", "USO": "Crude", "CPER": "Copper",
};

async function fetchQuote(symbol: string, apiKey: string): Promise<Quote | null> {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Finnhub quote error for ${symbol}:`, response.status);
      return null;
    }
    const data = await response.json();
    if (data.c && data.c > 0) {
      return {
        symbol,
        displaySymbol: DISPLAY_NAMES[symbol] || symbol,
        price: data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // IP-based rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests, please try again later." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const finnhubKey = Deno.env.get("FINNHUB_API_KEY");
    if (!finnhubKey) {
      console.error("Missing Finnhub API key");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allSymbols = [...INDEX_SYMBOLS, ...STOCK_SYMBOLS, ...CRYPTO_SYMBOLS, ...COMMODITY_SYMBOLS];
    const quotePromises = allSymbols.map(symbol => fetchQuote(symbol, finnhubKey));
    const results = await Promise.all(quotePromises);
    const quotes = results.filter((q): q is Quote => q !== null);

    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch quotes" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
