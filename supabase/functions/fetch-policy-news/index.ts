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

interface PolicyNewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  summary: string;
  category: "federal_reserve" | "trade_policy" | "fiscal_policy" | "labor_market" | "housing" | "regulation" | "international" | "general";
  politicalBias: "left" | "center" | "right";
}

// Policy topic keywords for categorization
const FEDERAL_RESERVE_KEYWORDS = ["federal reserve", "fed", "interest rate", "monetary policy", "fomc", "powell", "rate hike", "rate cut", "quantitative", "basis points", "fed meeting"];
const TRADE_POLICY_KEYWORDS = ["tariff", "trade policy", "import", "export", "trade war", "trade deal", "trade deficit", "customs", "trade agreement", "sanctions", "embargo"];
const FISCAL_POLICY_KEYWORDS = ["tax bill", "fiscal policy", "tax cut", "tax reform", "deficit", "national debt", "government spending", "budget", "appropriations", "stimulus"];
const LABOR_MARKET_KEYWORDS = ["minimum wage", "employment law", "labor law", "workers", "union", "unemployment", "jobs report", "workforce", "labor market", "wage"];
const HOUSING_KEYWORDS = ["housing policy", "mortgage", "housing market", "rent control", "affordable housing", "real estate regulation", "zoning", "housing crisis"];
const REGULATION_KEYWORDS = ["antitrust", "regulation", "deregulation", "ftc", "sec regulation", "compliance", "business regulation", "monopoly", "merger approval"];
const INTERNATIONAL_KEYWORDS = ["international economic", "g7", "g20", "imf", "world bank", "trade pact", "economic summit", "bilateral", "multilateral", "wto"];

function categorizeArticle(title: string, description: string): PolicyNewsArticle["category"] {
  const text = `${title} ${description}`.toLowerCase();
  if (FEDERAL_RESERVE_KEYWORDS.some(kw => text.includes(kw))) return "federal_reserve";
  if (TRADE_POLICY_KEYWORDS.some(kw => text.includes(kw))) return "trade_policy";
  if (FISCAL_POLICY_KEYWORDS.some(kw => text.includes(kw))) return "fiscal_policy";
  if (LABOR_MARKET_KEYWORDS.some(kw => text.includes(kw))) return "labor_market";
  if (HOUSING_KEYWORDS.some(kw => text.includes(kw))) return "housing";
  if (REGULATION_KEYWORDS.some(kw => text.includes(kw))) return "regulation";
  if (INTERNATIONAL_KEYWORDS.some(kw => text.includes(kw))) return "international";
  return "general";
}

// Source to political bias mapping (same as main feed)
const sourceBiasMap: Record<string, "left" | "center" | "right"> = {
  "cnn": "left", "msnbc": "left", "nytimes": "left", "washingtonpost": "left",
  "huffpost": "left", "vox": "left", "slate": "left",
  "cnbc": "center", "wsj": "center", "reuters": "center", "bloomberg": "center",
  "marketwatch": "center", "yahoo": "center", "apnews": "center", "npr": "center",
  "thehill": "center", "usatoday": "center",
  "fox": "right", "foxnews": "right", "foxbusiness": "right", "nypost": "right",
  "dailywire": "right", "breitbart": "right", "newsmax": "right",
};

function detectBias(source: string): "left" | "center" | "right" {
  const lower = source.toLowerCase();
  for (const [key, bias] of Object.entries(sourceBiasMap)) {
    if (lower.includes(key)) return bias;
  }
  return "center";
}

// Search terms for economic policy news
const POLICY_SEARCH_TERMS = "federal reserve,tariffs,trade policy,tax bill,fiscal policy,labor law,regulation,antitrust,housing policy,interest rates,monetary policy,government spending";

async function fetchMarketauxPolicyNews(apiKey: string): Promise<PolicyNewsArticle[]> {
  try {
    const url = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&language=en&filter_entities=true&limit=50&search=${encodeURIComponent(POLICY_SEARCH_TERMS)}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Marketaux policy news error:", response.status);
      return [];
    }
    const data = await response.json();
    if (!data.data) return [];
    return data.data.map((article: any) => ({
      id: `policy-mx-${article.uuid}`,
      title: article.title || "Untitled",
      source: article.source || "Unknown",
      url: article.url || "#",
      imageUrl: article.image_url || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop",
      publishedAt: article.published_at || new Date().toISOString(),
      summary: article.description || article.snippet || "",
      category: categorizeArticle(article.title || "", article.description || ""),
      politicalBias: detectBias(article.source || ""),
    }));
  } catch (error) {
    console.error("Marketaux policy fetch error:", error);
    return [];
  }
}

async function fetchFinnhubPolicyNews(apiKey: string): Promise<PolicyNewsArticle[]> {
  try {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Finnhub policy news error:", response.status);
      return [];
    }
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    // Filter for policy-relevant articles
    const policyKeywords = [
      ...FEDERAL_RESERVE_KEYWORDS, ...TRADE_POLICY_KEYWORDS, ...FISCAL_POLICY_KEYWORDS,
      ...LABOR_MARKET_KEYWORDS, ...HOUSING_KEYWORDS, ...REGULATION_KEYWORDS, ...INTERNATIONAL_KEYWORDS,
    ];

    return data
      .filter((article: any) => {
        const text = `${article.headline} ${article.summary}`.toLowerCase();
        return policyKeywords.some(kw => text.includes(kw));
      })
      .slice(0, 30)
      .map((article: any) => ({
        id: `policy-fh-${article.id}`,
        title: article.headline || "Untitled",
        source: article.source || "Unknown",
        url: article.url || "#",
        imageUrl: article.image || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop",
        publishedAt: article.datetime ? new Date(article.datetime * 1000).toISOString() : new Date().toISOString(),
        summary: article.summary || "",
        category: categorizeArticle(article.headline || "", article.summary || ""),
        politicalBias: detectBias(article.source || ""),
      }));
  } catch (error) {
    console.error("Finnhub policy fetch error:", error);
    return [];
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests, please try again later." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const marketauxKey = Deno.env.get("MARKETAUX_API_KEY");
    const finnhubKey = Deno.env.get("FINNHUB_API_KEY");

    if (!marketauxKey && !finnhubKey) {
      return new Response(
        JSON.stringify({ error: "API keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [marketauxNews, finnhubNews] = await Promise.all([
      marketauxKey ? fetchMarketauxPolicyNews(marketauxKey) : Promise.resolve([]),
      finnhubKey ? fetchFinnhubPolicyNews(finnhubKey) : Promise.resolve([]),
    ]);

    const allNews = [...marketauxNews, ...finnhubNews];
    const seenTitles = new Set<string>();
    const uniqueNews = allNews.filter(article => {
      const normalized = article.title.toLowerCase().substring(0, 50);
      if (seenTitles.has(normalized)) return false;
      seenTitles.add(normalized);
      return true;
    });

    uniqueNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return new Response(JSON.stringify({ articles: uniqueNews.slice(0, 50) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching policy news:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch policy news" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
