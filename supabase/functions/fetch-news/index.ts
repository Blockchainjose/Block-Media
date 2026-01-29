import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

// Map sources to political bias (simplified heuristic)
const sourceBiasMap: Record<string, "left" | "center" | "right"> = {
  "cnbc": "center",
  "wsj": "center",
  "fox": "right",
  "foxbusiness": "right",
  "cnn": "left",
  "msnbc": "left",
  "reuters": "center",
  "bloomberg": "center",
  "marketwatch": "center",
  "yahoo": "center",
  "default": "center",
};

function detectBias(source: string): "left" | "center" | "right" {
  const lowerSource = source.toLowerCase();
  for (const [key, bias] of Object.entries(sourceBiasMap)) {
    if (lowerSource.includes(key)) {
      return bias;
    }
  }
  return "center";
}

function generateBiasPercentages(
  primaryBias: "left" | "center" | "right"
): { left: number; center: number; right: number } {
  // Generate realistic percentages based on primary bias
  const basePercentages = {
    left: primaryBias === "left" ? 50 + Math.random() * 15 : 15 + Math.random() * 15,
    center: primaryBias === "center" ? 45 + Math.random() * 15 : 25 + Math.random() * 15,
    right: primaryBias === "right" ? 50 + Math.random() * 15 : 15 + Math.random() * 15,
  };

  // Normalize to 100%
  const total = basePercentages.left + basePercentages.center + basePercentages.right;
  return {
    left: Math.round((basePercentages.left / total) * 100),
    center: Math.round((basePercentages.center / total) * 100),
    right: Math.round((basePercentages.right / total) * 100),
  };
}

function detectCategory(
  title: string,
  description: string
): "crypto" | "global_markets" | "commodities" {
  const text = `${title} ${description}`.toLowerCase();

  const cryptoKeywords = [
    "bitcoin",
    "btc",
    "ethereum",
    "eth",
    "crypto",
    "blockchain",
    "defi",
    "nft",
    "altcoin",
    "dogecoin",
    "solana",
    "ripple",
    "xrp",
  ];
  const commodityKeywords = [
    "oil",
    "gold",
    "silver",
    "copper",
    "wheat",
    "corn",
    "natural gas",
    "commodity",
    "crude",
    "metals",
    "agriculture",
  ];

  if (cryptoKeywords.some((kw) => text.includes(kw))) {
    return "crypto";
  }
  if (commodityKeywords.some((kw) => text.includes(kw))) {
    return "commodities";
  }
  return "global_markets";
}

async function fetchMarketauxNews(apiKey: string): Promise<NewsArticle[]> {
  try {
    const url = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&language=en&filter_entities=true&limit=10`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Marketaux API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

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
  } catch (error) {
    console.error("Marketaux fetch error:", error);
    return [];
  }
}

async function fetchFinnhubNews(apiKey: string): Promise<NewsArticle[]> {
  try {
    // Fetch general market news
    const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Finnhub API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

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
  } catch (error) {
    console.error("Finnhub fetch error:", error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const marketauxKey = Deno.env.get("MARKETAUX_API_KEY");
    const finnhubKey = Deno.env.get("FINNHUB_API_KEY");

    if (!marketauxKey || !finnhubKey) {
      console.error("Missing API keys");
      return new Response(
        JSON.stringify({ error: "API keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from both APIs in parallel
    const [marketauxArticles, finnhubArticles] = await Promise.all([
      fetchMarketauxNews(marketauxKey),
      fetchFinnhubNews(finnhubKey),
    ]);

    // Combine and sort by date
    const allArticles = [...marketauxArticles, ...finnhubArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return new Response(JSON.stringify({ articles: allArticles }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch news" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
