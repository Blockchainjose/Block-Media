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

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
  category: "crypto" | "global_markets" | "commodities";
  aiSummary: string;
  politicalBias: "left" | "center" | "right";
  biasPercentages: { left: number; center: number; right: number };
  balancedSummary: string;
}

const sourceBiasMap: Record<string, "left" | "center" | "right"> = {
  "cnn": "left", "msnbc": "left", "nytimes": "left", "washingtonpost": "left",
  "huffpost": "left", "huffingtonpost": "left", "vox": "left", "thedailybeast": "left",
  "motherjones": "left", "slate": "left",
  "cnbc": "center", "wsj": "center", "reuters": "center", "bloomberg": "center",
  "marketwatch": "center", "yahoo": "center", "apnews": "center", "npr": "center",
  "usatoday": "center", "thehill": "center",
  "fox": "right", "foxnews": "right", "foxbusiness": "right", "nypost": "right",
  "washingtontimes": "right", "dailywire": "right", "breitbart": "right", "newsmax": "right",
  "default": "center",
};

function detectBias(source: string): "left" | "center" | "right" {
  const lowerSource = source.toLowerCase();
  for (const [key, bias] of Object.entries(sourceBiasMap)) {
    if (lowerSource.includes(key)) return bias;
  }
  return "center";
}

function generateBiasPercentages(primaryBias: "left" | "center" | "right") {
  const basePercentages = {
    left: primaryBias === "left" ? 50 + Math.random() * 15 : 15 + Math.random() * 15,
    center: primaryBias === "center" ? 45 + Math.random() * 15 : 25 + Math.random() * 15,
    right: primaryBias === "right" ? 50 + Math.random() * 15 : 15 + Math.random() * 15,
  };
  const total = basePercentages.left + basePercentages.center + basePercentages.right;
  return {
    left: Math.round((basePercentages.left / total) * 100),
    center: Math.round((basePercentages.center / total) * 100),
    right: Math.round((basePercentages.right / total) * 100),
  };
}

function detectCategory(title: string, description: string): "crypto" | "global_markets" | "commodities" {
  const text = `${title} ${description}`.toLowerCase();
  const cryptoKeywords = ["bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "defi", "nft", "altcoin", "dogecoin", "solana", "ripple", "xrp"];
  const commodityKeywords = ["oil", "gold", "silver", "copper", "wheat", "corn", "natural gas", "commodity", "crude", "metals", "agriculture"];
  if (cryptoKeywords.some((kw) => text.includes(kw))) return "crypto";
  if (commodityKeywords.some((kw) => text.includes(kw))) return "commodities";
  return "global_markets";
}

const LEFT_SOURCES = ["cnn.com", "msnbc.com", "nytimes.com"];
const CENTER_SOURCES = ["cnbc.com", "wsj.com", "marketwatch.com"];
const RIGHT_SOURCES = ["foxnews.com", "foxbusiness.com"];
const US_NEWS_SOURCES = [...LEFT_SOURCES, ...CENTER_SOURCES, ...RIGHT_SOURCES];

function isAllowedSource(source: string): boolean {
  const lowerSource = source.toLowerCase();
  return US_NEWS_SOURCES.some(allowed => lowerSource.includes(allowed.replace('.com', '')));
}

function balanceArticles(articles: NewsArticle[]): NewsArticle[] {
  const leftArticles = articles.filter(a => a.politicalBias === "left");
  const centerArticles = articles.filter(a => a.politicalBias === "center");
  const rightArticles = articles.filter(a => a.politicalBias === "right");
  const balanced: NewsArticle[] = [];
  const maxPerCategory = Math.max(leftArticles.length, centerArticles.length, rightArticles.length);
  for (let i = 0; i < maxPerCategory; i++) {
    if (leftArticles[i]) balanced.push(leftArticles[i]);
    if (centerArticles[i]) balanced.push(centerArticles[i]);
    if (rightArticles[i]) balanced.push(rightArticles[i]);
  }
  return balanced;
}

async function fetchMarketauxNews(apiKey: string, sources?: string[]): Promise<NewsArticle[]> {
  try {
    let url = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&language=en&filter_entities=true&limit=15`;
    if (sources && sources.length > 0) url += `&domains=${sources.join(",")}`;
    const response = await fetch(url);
    if (!response.ok) { console.error("Marketaux API error:", response.status); return []; }
    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) return [];
    return data.data.map((article: any, index: number) => {
      const bias = detectBias(article.source || "unknown");
      const category = detectCategory(article.title || "", article.description || "");
      return {
        id: `marketaux-${article.uuid || index}`,
        title: article.title || "Untitled",
        source: article.source || "Unknown",
        imageUrl: article.image_url || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop`,
        url: article.url || "#",
        publishedAt: article.published_at || new Date().toISOString(),
        category,
        aiSummary: article.description || article.snippet || "No summary available.",
        politicalBias: bias,
        biasPercentages: generateBiasPercentages(bias),
        balancedSummary: `This article from ${article.source || "this source"} covers ${category.replace("_", " ")} news with a ${bias} perspective.`,
      };
    });
  } catch (error) { console.error("Marketaux fetch error:", error); return []; }
}

async function fetchFinnhubNews(apiKey: string): Promise<NewsArticle[]> {
  try {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) { console.error("Finnhub API error:", response.status); return []; }
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 10).map((article: any, index: number) => {
      const bias = detectBias(article.source || "unknown");
      const category = detectCategory(article.headline || "", article.summary || "");
      return {
        id: `finnhub-${article.id || index}`,
        title: article.headline || "Untitled",
        source: article.source || "Unknown",
        imageUrl: article.image || `https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop`,
        url: article.url || "#",
        publishedAt: article.datetime ? new Date(article.datetime * 1000).toISOString() : new Date().toISOString(),
        category,
        aiSummary: article.summary || "No summary available.",
        politicalBias: bias,
        biasPercentages: generateBiasPercentages(bias),
        balancedSummary: `This article from ${article.source || "this source"} covers ${category.replace("_", " ")} news with a ${bias} perspective.`,
      };
    });
  } catch (error) { console.error("Finnhub fetch error:", error); return []; }
}

async function persistArticles(articles: NewsArticle[]) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const rows = articles.map(a => ({
      id: a.id,
      title: a.title,
      source: a.source,
      image_url: a.imageUrl,
      url: a.url,
      published_at: a.publishedAt,
      category: a.category,
      article_type: 'news',
      ai_summary: a.aiSummary,
      balanced_summary: a.balancedSummary,
      political_bias: a.politicalBias,
      bias_left: a.biasPercentages.left,
      bias_center: a.biasPercentages.center,
      bias_right: a.biasPercentages.right,
    }));

    const { error } = await supabase.from('news_articles').upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
    if (error) console.error("Error persisting news articles:", error);
  } catch (e) {
    console.error("Persist articles error:", e);
  }
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

    if (!marketauxKey || !finnhubKey) {
      return new Response(JSON.stringify({ error: "API keys not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const [marketauxArticles, finnhubArticles] = await Promise.all([
      fetchMarketauxNews(marketauxKey, US_NEWS_SOURCES),
      fetchFinnhubNews(finnhubKey),
    ]);

    const seenTitles = new Set<string>();
    const freshArticles = [...marketauxArticles, ...finnhubArticles]
      .filter(article => {
        if (!isAllowedSource(article.source)) return false;
        const normalizedTitle = article.title.toLowerCase().trim();
        if (seenTitles.has(normalizedTitle)) return false;
        seenTitles.add(normalizedTitle);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Persist new articles to DB
    if (freshArticles.length > 0) {
      await persistArticles(freshArticles);
    }

    // Return all stored news articles from DB (primary source of truth)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: dbArticles, error: dbError } = await supabase
      .from('news_articles')
      .select('*')
      .eq('article_type', 'news')
      .order('published_at', { ascending: false })
      .limit(100);

    if (dbError) {
      console.error("DB read error:", dbError);
      // Fallback to fresh articles
      return new Response(JSON.stringify({ articles: balanceArticles(freshArticles) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const articles: NewsArticle[] = (dbArticles || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      source: r.source,
      imageUrl: r.image_url,
      url: r.url,
      publishedAt: r.published_at,
      category: r.category,
      aiSummary: r.ai_summary || "",
      politicalBias: r.political_bias || "center",
      biasPercentages: { left: r.bias_left, center: r.bias_center, right: r.bias_right },
      balancedSummary: r.balanced_summary || "",
      leftPerspective: r.left_perspective,
      rightPerspective: r.right_perspective,
      centerPerspective: r.center_perspective,
    }));

    return new Response(JSON.stringify({ articles: balanceArticles(articles) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
