import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BASE_URL = "https://blockmediacorp.com";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

// Static routes with their change frequency and priority
const STATIC_ROUTES = [
  { path: "/", changefreq: "hourly", priority: "1.0" },
  { path: "/markets", changefreq: "hourly", priority: "0.9" },
  { path: "/crypto", changefreq: "hourly", priority: "0.9" },
  { path: "/crossfire", changefreq: "hourly", priority: "0.9" },
  { path: "/policy", changefreq: "hourly", priority: "0.9" },
  { path: "/community", changefreq: "daily", priority: "0.8" },
  { path: "/features", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/dashboard", changefreq: "daily", priority: "0.7" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
];

interface ArticleEntry {
  path: string;
  lastmod: string;
}

// Fetch article IDs from an internal edge function
async function fetchArticles(fnName: string): Promise<ArticleEntry[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const articles = Array.isArray(data) ? data : [];
    return articles.map((a: any) => ({
      path: a.id ? getArticlePath(fnName, a.id) : "",
      lastmod: a.publishedAt
        ? new Date(a.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    })).filter((e: ArticleEntry) => e.path);
  } catch {
    return [];
  }
}

function getArticlePath(fnName: string, id: string): string {
  switch (fnName) {
    case "fetch-news":
      return `/article/${id}`;
    case "fetch-crypto-news":
      return `/crypto/${id}`;
    case "crossfire-analyze":
      return `/crossfire/${id}`;
    default:
      return "";
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Cache the sitemap for 10 minutes
let cachedSitemap: string | null = null;
let cacheExpiry = 0;

serve(async () => {
  const now = Date.now();

  if (cachedSitemap && now < cacheExpiry) {
    return new Response(cachedSitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const today = new Date().toISOString().split("T")[0];

  // Fetch dynamic articles from all sources in parallel
  const [newsArticles, cryptoArticles, crossfireArticles] = await Promise.all([
    fetchArticles("fetch-news"),
    fetchArticles("fetch-crypto-news"),
    fetchArticles("crossfire-analyze"),
  ]);

  // Build XML
  const entries: string[] = [];

  // Static routes
  for (const route of STATIC_ROUTES) {
    entries.push(buildUrlEntry(`${BASE_URL}${route.path}`, today, route.changefreq, route.priority));
  }

  // Dynamic article routes
  const allArticles = [...newsArticles, ...cryptoArticles, ...crossfireArticles];
  const seen = new Set<string>();
  for (const article of allArticles) {
    if (seen.has(article.path)) continue;
    seen.add(article.path);
    entries.push(buildUrlEntry(`${BASE_URL}${article.path}`, article.lastmod, "daily", "0.7"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  cachedSitemap = xml;
  cacheExpiry = now + 10 * 60 * 1000; // 10 min

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
