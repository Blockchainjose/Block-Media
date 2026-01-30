import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Symbol mappings for different asset types (using ETF proxies for indices/commodities)
const SYMBOL_MAP: Record<string, { finnhubSymbol: string; type: "stock" | "crypto" | "forex" }> = {
  // Index ETFs
  "S&P 500": { finnhubSymbol: "SPY", type: "stock" },
  "NASDAQ": { finnhubSymbol: "QQQ", type: "stock" },
  "DOW": { finnhubSymbol: "DIA", type: "stock" },
  // Stocks (MAG7 + additional)
  "AAPL": { finnhubSymbol: "AAPL", type: "stock" },
  "MSFT": { finnhubSymbol: "MSFT", type: "stock" },
  "GOOGL": { finnhubSymbol: "GOOGL", type: "stock" },
  "AMZN": { finnhubSymbol: "AMZN", type: "stock" },
  "NVDA": { finnhubSymbol: "NVDA", type: "stock" },
  "META": { finnhubSymbol: "META", type: "stock" },
  "TSLA": { finnhubSymbol: "TSLA", type: "stock" },
  "PLTR": { finnhubSymbol: "PLTR", type: "stock" },
  "CRWV": { finnhubSymbol: "CRWV", type: "stock" },
  // Crypto
  "BTC": { finnhubSymbol: "BINANCE:BTCUSDT", type: "crypto" },
  "ETH": { finnhubSymbol: "BINANCE:ETHUSDT", type: "crypto" },
  "SOL": { finnhubSymbol: "BINANCE:SOLUSDT", type: "crypto" },
  "XRP": { finnhubSymbol: "BINANCE:XRPUSDT", type: "crypto" },
  "BNB": { finnhubSymbol: "BINANCE:BNBUSDT", type: "crypto" },
  // Commodity ETFs
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
    if (!response.ok) {
      console.error(`Finnhub candle error for ${symbol}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.s !== "ok" || !data.t) {
      console.log(`No candle data for ${symbol}:`, data);
      return [];
    }
    
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({
        timestamp: data.t[i] * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i] || 0,
      });
    }
    
    return candles;
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    return [];
  }
}

async function fetchCryptoCandles(symbol: string, apiKey: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Finnhub crypto candle error for ${symbol}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.s !== "ok" || !data.t) {
      console.log(`No crypto candle data for ${symbol}:`, data);
      return [];
    }
    
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({
        timestamp: data.t[i] * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i] || 0,
      });
    }
    
    return candles;
  } catch (error) {
    console.error(`Error fetching crypto candles for ${symbol}:`, error);
    return [];
  }
}

async function fetchForexCandles(symbol: string, apiKey: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const url = `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Finnhub forex candle error for ${symbol}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.s !== "ok" || !data.t) {
      console.log(`No forex candle data for ${symbol}:`, data);
      return [];
    }
    
    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({
        timestamp: data.t[i] * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i] || 0,
      });
    }
    
    return candles;
  } catch (error) {
    console.error(`Error fetching forex candles for ${symbol}:`, error);
    return [];
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

    const { symbol, resolution = "D", days = 30 } = await req.json();

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Symbol is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const symbolConfig = SYMBOL_MAP[symbol];
    if (!symbolConfig) {
      return new Response(
        JSON.stringify({ error: `Unknown symbol: ${symbol}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 24 * 60 * 60);

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
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
