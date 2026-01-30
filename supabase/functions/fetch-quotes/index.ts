import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Quote {
  symbol: string;
  displaySymbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Major Indices + MAG7 + Crypto + Commodities symbols
const INDEX_SYMBOLS = ["^GSPC", "^IXIC", "^DJI"]; // SPX, NASDAQ, DOW
const STOCK_SYMBOLS = ["PLTR", "CRWV", "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"];
const CRYPTO_SYMBOLS = ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT", "BINANCE:XRPUSDT", "BINANCE:BNBUSDT"];
const COMMODITY_SYMBOLS = ["OANDA:XAU_USD", "OANDA:XAG_USD", "OANDA:XPT_USD", "OANDA:WTICO_USD", "OANDA:XCUUSD"];

const DISPLAY_NAMES: Record<string, string> = {
  // Indices
  "^GSPC": "S&P 500",
  "^IXIC": "NASDAQ",
  "^DJI": "DOW",
  // Tech stocks
  "PLTR": "PLTR",
  "CRWV": "CRWV",
  "AAPL": "AAPL",
  "MSFT": "MSFT",
  "GOOGL": "GOOGL",
  "AMZN": "AMZN",
  "NVDA": "NVDA",
  "META": "META",
  "TSLA": "TSLA",
  // Crypto
  "BINANCE:BTCUSDT": "BTC",
  "BINANCE:ETHUSDT": "ETH",
  "BINANCE:SOLUSDT": "SOL",
  "BINANCE:XRPUSDT": "XRP",
  "BINANCE:BNBUSDT": "BNB",
  // Commodities
  "OANDA:XAU_USD": "Gold",
  "OANDA:XAG_USD": "Silver",
  "OANDA:XPT_USD": "Platinum",
  "OANDA:WTICO_USD": "Crude",
  "OANDA:XCUUSD": "Copper",
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
    
    // c = current price, d = change, dp = percent change, pc = previous close
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    
    // Fetch all quotes in parallel
    const quotePromises = allSymbols.map(symbol => fetchQuote(symbol, finnhubKey));
    const results = await Promise.all(quotePromises);
    
    // Filter out null results
    const quotes = results.filter((q): q is Quote => q !== null);

    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch quotes" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
