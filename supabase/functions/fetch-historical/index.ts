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

// IP-based rate limiting: 30 requests per minute
const ipRateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
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

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const SYMBOL_MAP: Record<string, { finnhubSymbol: string; type: "stock" | "crypto" | "forex" }> = {
  "S&P 500": { finnhubSymbol: "SPY", type: "stock" },
  "NASDAQ": { finnhubSymbol: "QQQ", type: "stock" },
  "DOW": { finnhubSymbol: "DIA", type: "stock" },
  "AAPL": { finnhubSymbol: "AAPL", type: "stock" },
  "MSFT": { finnhubSymbol: "MSFT", type: "stock" },
  "GOOGL": { finnhubSymbol: "GOOGL", type: "stock" },
  "AMZN": { finnhubSymbol: "AMZN", type: "stock" },
  "NVDA": { finnhubSymbol: "NVDA", type: "stock" },
  "META": { finnhubSymbol: "META", type: "stock" },
  "TSLA": { finnhubSymbol: "TSLA", type: "stock" },
  "PLTR": { finnhubSymbol: "PLTR", type: "stock" },
  "CRWV": { finnhubSymbol: "CRWV", type: "stock" },
  "BTC": { finnhubSymbol: "BINANCE:BTCUSDT", type: "crypto" },
  "ETH": { finnhubSymbol: "BINANCE:ETHUSDT", type: "crypto" },
  "SOL": { finnhubSymbol: "BINANCE:SOLUSDT", type: "crypto" },
  "XRP": { finnhubSymbol: "BINANCE:XRPUSDT", type: "crypto" },
  "BNB": { finnhubSymbol: "BINANCE:BNBUSDT", type: "crypto" },
  "Gold": { finnhubSymbol: "GLD", type: "stock" },
  "Silver": { finnhubSymbol: "SLV", type: "stock" },
  "Platinum": { finnhubSymbol: "PPLT", type: "stock" },
  "Copper": { finnhubSymbol: "CPER", type: "stock" },
  "Crude": { finnhubSymbol: "USO", type: "stock" },
};

async function fetchStockCandles(symbol: string, apiKey: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) { console.error(`Finnhub candle error for ${symbol}:`, response.status); return []; }
    const data = await response.json();
    if (data.s !== "ok" || !data.t) { console.log(`No candle data for ${symbol}:`, data); return []; }
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({ timestamp: data.t[i] * 1000, open: data.o[i], high: data.h[i], low: data.l[i], close: data.c[i], volume: data.v[i] || 0 });
    }
    return candles;
  } catch (error) { console.error(`Error fetching candles for ${symbol}:`, error); return []; }
}

async function fetchCryptoCandles(symbol: string, apiKey: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) { console.error(`Finnhub crypto candle error for ${symbol}:`, response.status); return []; }
    const data = await response.json();
    if (data.s !== "ok" || !data.t) { console.log(`No crypto candle data for ${symbol}:`, data); return []; }
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({ timestamp: data.t[i] * 1000, open: data.o[i], high: data.h[i], low: data.l[i], close: data.c[i], volume: data.v[i] || 0 });
    }
    return candles;
  } catch (error) { console.error(`Error fetching crypto candles for ${symbol}:`, error); return []; }
}

async function fetchForexCandles(symbol: string, apiKey: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const url = `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) { console.error(`Finnhub forex candle error for ${symbol}:`, response.status); return []; }
    const data = await response.json();
    if (data.s !== "ok" || !data.t) { console.log(`No forex candle data for ${symbol}:`, data); return []; }
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({ timestamp: data.t[i] * 1000, open: data.o[i], high: data.h[i], low: data.l[i], close: data.c[i], volume: data.v[i] || 0 });
    }
    return candles;
  } catch (error) { console.error(`Error fetching forex candles for ${symbol}:`, error); return []; }
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

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { symbol, resolution = "D", days = 30 } = body as Record<string, unknown>;

    if (!symbol || typeof symbol !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid symbol is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate days: must be a number between 1 and 365
    const parsedDays = typeof days === "number" ? days : parseInt(String(days), 10);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      return new Response(
        JSON.stringify({ error: "Days must be between 1 and 365" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate resolution against allowed Finnhub values
    const allowedResolutions = ["1", "5", "15", "30", "60", "D", "W", "M"];
    if (typeof resolution !== "string" || !allowedResolutions.includes(resolution)) {
      return new Response(
        JSON.stringify({ error: "Invalid resolution. Allowed: 1, 5, 15, 30, 60, D, W, M" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const symbolConfig = SYMBOL_MAP[symbol];
    if (!symbolConfig) {
      return new Response(
        JSON.stringify({ error: "Unknown symbol" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const to = Math.floor(Date.now() / 1000);
    const from = to - (parsedDays * 24 * 60 * 60);
    let candles: Candle[] = [];

    switch (symbolConfig.type) {
      case "stock":
        candles = await fetchStockCandles(symbolConfig.finnhubSymbol, finnhubKey, resolution, from, to);
        break;
      case "crypto":
        candles = await fetchCryptoCandles(symbolConfig.finnhubSymbol, finnhubKey, resolution, from, to);
        break;
      case "forex":
        candles = await fetchForexCandles(symbolConfig.finnhubSymbol, finnhubKey, resolution, from, to);
        break;
    }

    return new Response(JSON.stringify({ symbol, candles }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch historical data" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
