import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

// Keywords for categorization
const REGULATION_KEYWORDS = ["regulation", "sec", "cftc", "law", "legal", "ban", "tax", "compliance", "policy", "government", "federal", "legislation"];
const PROTOCOL_KEYWORDS = ["protocol", "defi", "dex", "swap", "yield", "staking", "liquidity", "airdrop", "fork", "upgrade", "v2", "v3", "layer"];
const BLOCKCHAIN_KEYWORDS = ["blockchain", "network", "mainnet", "testnet", "consensus", "node", "validator", "chain", "scaling", "rollup", "l2", "bridge"];
const PRICE_KEYWORDS = ["price", "rally", "surge", "drop", "crash", "bull", "bear", "ath", "high", "low", "trading", "volume", "market cap"];

function categorizeArticle(title: string, description: string): CryptoNewsArticle["category"] {
  const text = `${title} ${description}`.toLowerCase();
  
  if (REGULATION_KEYWORDS.some(keyword => text.includes(keyword))) {
    return "regulation";
  }
  if (PROTOCOL_KEYWORDS.some(keyword => text.includes(keyword))) {
    return "protocol";
  }
  if (BLOCKCHAIN_KEYWORDS.some(keyword => text.includes(keyword))) {
    return "blockchain";
  }
  if (PRICE_KEYWORDS.some(keyword => text.includes(keyword))) {
    return "price";
  }
  return "general";
}

function extractRelatedSymbols(title: string, description: string): string[] {
  const text = `${title} ${description}`.toUpperCase();
  const symbols: string[] = [];
  
  const cryptoMentions: Record<string, string[]> = {
    "BTC": ["BITCOIN", "BTC"],
    "ETH": ["ETHEREUM", "ETH", "ETHER"],
    "SOL": ["SOLANA", "SOL"],
    "XRP": ["RIPPLE", "XRP"],
    "ADA": ["CARDANO", "ADA"],
    "DOT": ["POLKADOT", "DOT"],
    "AVAX": ["AVALANCHE", "AVAX"],
    "MATIC": ["POLYGON", "MATIC"],
    "LINK": ["CHAINLINK", "LINK"],
    "UNI": ["UNISWAP", "UNI"],
  };
  
  for (const [symbol, keywords] of Object.entries(cryptoMentions)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      symbols.push(symbol);
    }
  }
  
  return symbols;
}

async function fetchMarketauxCryptoNews(apiKey: string): Promise<CryptoNewsArticle[]> {
  const url = `https://api.marketaux.com/v1/news/all?filter_entities=true&language=en&industries=cryptocurrency&api_token=${apiKey}&limit=50`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Marketaux crypto news error:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data) {
      return [];
    }
    
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
  } catch (error) {
    console.error("Error fetching Marketaux crypto news:", error);
    return [];
  }
}

async function fetchFinnhubCryptoNews(apiKey: string): Promise<CryptoNewsArticle[]> {
  const url = `https://finnhub.io/api/v1/news?category=crypto&token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Finnhub crypto news error:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
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
  } catch (error) {
    console.error("Error fetching Finnhub crypto news:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const marketauxKey = Deno.env.get("MARKETAUX_API_KEY");
    const finnhubKey = Deno.env.get("FINNHUB_API_KEY");

    if (!marketauxKey && !finnhubKey) {
      console.error("Missing API keys");
      return new Response(
        JSON.stringify({ error: "API keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from both sources in parallel
    const [marketauxNews, finnhubNews] = await Promise.all([
      marketauxKey ? fetchMarketauxCryptoNews(marketauxKey) : Promise.resolve([]),
      finnhubKey ? fetchFinnhubCryptoNews(finnhubKey) : Promise.resolve([]),
    ]);

    // Combine and dedupe by title similarity
    const allNews = [...marketauxNews, ...finnhubNews];
    const seenTitles = new Set<string>();
    const uniqueNews = allNews.filter(article => {
      const normalizedTitle = article.title.toLowerCase().substring(0, 50);
      if (seenTitles.has(normalizedTitle)) {
        return false;
      }
      seenTitles.add(normalizedTitle);
      return true;
    });

    // Sort by date
    uniqueNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return new Response(JSON.stringify({ articles: uniqueNews.slice(0, 50) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch crypto news" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
