import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface CryptoNewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  summary: string;
  category: "price" | "regulation" | "protocol" | "blockchain" | "general";
  relatedSymbols: string[];
}

const REGULATION_KEYWORDS = ["regulation", "sec", "cftc", "law", "legal", "ban", "tax", "compliance", "policy", "government", "federal", "legislation"];
const PROTOCOL_KEYWORDS = ["protocol", "defi", "dex", "swap", "yield", "staking", "liquidity", "airdrop", "fork", "upgrade", "v2", "v3", "layer"];
const BLOCKCHAIN_KEYWORDS = ["blockchain", "network", "mainnet", "testnet", "consensus", "node", "validator", "chain", "scaling", "rollup", "l2", "bridge"];
const PRICE_KEYWORDS = ["price", "rally", "surge", "drop", "crash", "bull", "bear", "ath", "high", "low", "trading", "volume", "market cap"];

function categorizeArticle(title: string, description: string): CryptoNewsArticle["category"] {
  const text = `${title} ${description}`.toLowerCase();
  if (REGULATION_KEYWORDS.some(keyword => text.includes(keyword))) return "regulation";
  if (PROTOCOL_KEYWORDS.some(keyword => text.includes(keyword))) return "protocol";
  if (BLOCKCHAIN_KEYWORDS.some(keyword => text.includes(keyword))) return "blockchain";
  if (PRICE_KEYWORDS.some(keyword => text.includes(keyword))) return "price";
  return "general";
}

function extractRelatedSymbols(title: string, description: string): string[] {
  const text = `${title} ${description}`.toUpperCase();
  const symbols: string[] = [];
  const cryptoMentions: Record<string, string[]> = {
    "BTC": ["BITCOIN", "BTC"], "ETH": ["ETHEREUM", "ETH", "ETHER"],
    "SOL": ["SOLANA", "SOL"], "XRP": ["RIPPLE", "XRP"],
    "ADA": ["CARDANO", "ADA"], "DOT": ["POLKADOT", "DOT"],
    "AVAX": ["AVALANCHE", "AVAX"], "MATIC": ["POLYGON", "MATIC"],
    "LINK": ["CHAINLINK", "LINK"], "UNI": ["UNISWAP", "UNI"],
  };
  for (const [symbol, keywords] of Object.entries(cryptoMentions)) {
    if (keywords.some(keyword => text.includes(keyword))) symbols.push(symbol);
  }
  return symbols;
}

async function fetchMarketauxCryptoNews(apiKey: string): Promise<CryptoNewsArticle[]> {
  const url = `https://api.marketaux.com/v1/news/all?filter_entities=true&language=en&industries=cryptocurrency&api_token=${apiKey}&limit=50`;
  try {
    const response = await fetch(url);
    if (!response.ok) { console.error("Marketaux crypto news error:", response.status); return []; }
    const data = await response.json();
    if (!data.data) return [];
    return data.data.map((article: any) => ({
      id: article.uuid,
      title: article.title,
      source: article.source,
      url: article.url,
      imageUrl: article.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      publishedAt: article.published_at,
      summary: article.description || article.snippet || "",
      category: categorizeArticle(article.title, article.description || ""),
      relatedSymbols: extractRelatedSymbols(article.title, article.description || ""),
    }));
  } catch (error) { console.error("Error fetching Marketaux crypto news:", error); return []; }
}

async function fetchFinnhubCryptoNews(apiKey: string): Promise<CryptoNewsArticle[]> {
  const url = `https://finnhub.io/api/v1/news?category=crypto&token=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) { console.error("Finnhub crypto news error:", response.status); return []; }
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 30).map((article: any) => ({
      id: `finnhub-${article.id}`,
      title: article.headline,
      source: article.source,
      url: article.url,
      imageUrl: article.image || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      publishedAt: new Date(article.datetime * 1000).toISOString(),
      summary: article.summary || "",
      category: categorizeArticle(article.headline, article.summary || ""),
      relatedSymbols: extractRelatedSymbols(article.headline, article.summary || ""),
    }));
  } catch (error) { console.error("Error fetching Finnhub crypto news:", error); return []; }
}

async function persistArticles(articles: CryptoNewsArticle[]) {
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const rows = articles.map(a => ({
      id: a.id,
      title: a.title,
      source: a.source,
      image_url: a.imageUrl,
      url: a.url,
      published_at: a.publishedAt,
      category: a.category,
      article_type: 'crypto',
      ai_summary: a.summary,
      related_symbols: a.relatedSymbols,
    }));
    const { error } = await supabase.from('news_articles').upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
    if (error) console.error("Error persisting crypto articles:", error);
  } catch (e) { console.error("Persist crypto articles error:", e); }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const marketauxKey = Deno.env.get("MARKETAUX_API_KEY");
    const finnhubKey = Deno.env.get("FINNHUB_API_KEY");

    if (!marketauxKey && !finnhubKey) {
      return new Response(JSON.stringify({ error: "API keys not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const [marketauxNews, finnhubNews] = await Promise.all([
      marketauxKey ? fetchMarketauxCryptoNews(marketauxKey) : Promise.resolve([]),
      finnhubKey ? fetchFinnhubCryptoNews(finnhubKey) : Promise.resolve([]),
    ]);

    const allNews = [...marketauxNews, ...finnhubNews];
    const seenTitles = new Set<string>();
    const freshArticles = allNews.filter(article => {
      const normalizedTitle = article.title.toLowerCase().substring(0, 50);
      if (seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);
      return true;
    });

    if (freshArticles.length > 0) await persistArticles(freshArticles);

    // Return from DB
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: dbArticles, error: dbError } = await supabase
      .from('news_articles')
      .select('*')
      .eq('article_type', 'crypto')
      .order('published_at', { ascending: false })
      .limit(100);

    if (dbError) {
      console.error("DB read error:", dbError);
      freshArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return new Response(JSON.stringify({ articles: freshArticles.slice(0, 50) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const articles: CryptoNewsArticle[] = (dbArticles || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      source: r.source,
      url: r.url,
      imageUrl: r.image_url || "",
      publishedAt: r.published_at,
      summary: r.ai_summary || "",
      category: r.category || "general",
      relatedSymbols: r.related_symbols || [],
    }));

    return new Response(JSON.stringify({ articles }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch crypto news" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
