import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ipRateMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || now > entry.reset) {
    ipRateMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

interface ArticleInput {
  id: string;
  title: string;
  source: string;
  aiSummary: string;
  url: string;
  imageUrl: string;
  politicalBias: "left" | "center" | "right";
  publishedAt: string;
}

function keywordCluster(articles: ArticleInput[]): ArticleInput[][] {
  const clusters: ArticleInput[][] = [];
  const used = new Set<string>();

  for (let i = 0; i < articles.length; i++) {
    if (used.has(articles[i].id)) continue;
    const group = [articles[i]];
    used.add(articles[i].id);

    const wordsA = new Set(
      articles[i].title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 3)
    );

    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(articles[j].id)) continue;
      const wordsB = articles[j].title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 3);
      const overlap = wordsB.filter((w) => wordsA.has(w)).length;
      const similarity = overlap / Math.max(wordsA.size, wordsB.length, 1);
      if (similarity >= 0.35 || overlap >= 3) {
        group.push(articles[j]);
        used.add(articles[j].id);
      }
    }

    const biases = new Set(group.map((a) => a.politicalBias));
    if (group.length >= 2 && biases.size >= 2) clusters.push(group);
  }

  return clusters;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const { articles } = (await req.json()) as { articles: ArticleInput[] };
    if (!articles || articles.length < 2) {
      return new Response(JSON.stringify({ stories: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let clusters: ArticleInput[][] = [];

    if (LOVABLE_API_KEY) {
      try {
        const clusterPrompt = `You are a news analyst. Given these article headlines and sources, identify groups of articles that cover THE SAME news event from different outlets. Only group articles about the exact same event.\n\nArticles:\n${articles.map((a, i) => `[${i}] "${a.title}" — ${a.source} (${a.politicalBias})`).join("\n")}\n\nReturn groups as JSON using this tool.`;

        const clusterRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a precise news clustering assistant." },
              { role: "user", content: clusterPrompt },
            ],
            tools: [{
              type: "function",
              function: {
                name: "report_clusters",
                description: "Report article clusters covering the same story",
                parameters: {
                  type: "object",
                  properties: {
                    clusters: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { indices: { type: "array", items: { type: "number" } } },
                        required: ["indices"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["clusters"],
                  additionalProperties: false,
                },
              },
            }],
            tool_choice: { type: "function", function: { name: "report_clusters" } },
          }),
        });

        if (clusterRes.ok) {
          const clusterData = await clusterRes.json();
          const toolCall = clusterData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const parsed = JSON.parse(toolCall.function.arguments);
            clusters = parsed.clusters
              .map((c: { indices: number[] }) => c.indices.map((idx: number) => articles[idx]).filter(Boolean))
              .filter((group: ArticleInput[]) => {
                const biases = new Set(group.map((a) => a.politicalBias));
                return group.length >= 2 && biases.size >= 2;
              });
          }
        }
      } catch (e) {
        console.error("AI clustering failed, falling back to keywords:", e);
      }
    }

    if (clusters.length === 0) clusters = keywordCluster(articles);

    if (clusters.length === 0) {
      return new Response(JSON.stringify({ stories: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate stories
    const stories = [];
    for (const cluster of clusters.slice(0, 5)) {
      const leanSpread = { left: 0, center: 0, right: 0 };
      const sources = cluster.map((a) => {
        leanSpread[a.politicalBias]++;
        return {
          articleId: a.id, source: a.source, headline: a.title, excerpt: a.aiSummary,
          url: a.url, imageUrl: a.imageUrl, politicalBias: a.politicalBias, publishedAt: a.publishedAt,
        };
      });

      let neutralHeadline = cluster[0].title;
      let factualSummary = "Multiple outlets are covering this story from different perspectives.";
      let breakdown = "Coverage varies across the political spectrum.";

      if (LOVABLE_API_KEY) {
        try {
          const breakdownPrompt = `Analyze these articles about the same news event:\n\n${cluster.map((a) => `Source: ${a.source} (${a.politicalBias})\nHeadline: "${a.title}"\nSummary: ${a.aiSummary}`).join("\n\n")}\n\nGenerate using the tool provided.`;

          const bdRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: "You are a neutral financial news analyst writing for investors. Be factual and concise." },
                { role: "user", content: breakdownPrompt },
              ],
              tools: [{
                type: "function",
                function: {
                  name: "generate_crossfire",
                  description: "Generate CrossFire analysis",
                  parameters: {
                    type: "object",
                    properties: {
                      neutralHeadline: { type: "string", description: "A neutral, factual headline (max 15 words)" },
                      factualSummary: { type: "string", description: "2-3 sentence factual summary" },
                      breakdown: { type: "string", description: "Paragraph explaining what each side emphasizes" },
                    },
                    required: ["neutralHeadline", "factualSummary", "breakdown"],
                    additionalProperties: false,
                  },
                },
              }],
              tool_choice: { type: "function", function: { name: "generate_crossfire" } },
            }),
          });

          if (bdRes.ok) {
            const bdData = await bdRes.json();
            const tc = bdData.choices?.[0]?.message?.tool_calls?.[0];
            if (tc) {
              const parsed = JSON.parse(tc.function.arguments);
              neutralHeadline = parsed.neutralHeadline || neutralHeadline;
              factualSummary = parsed.factualSummary || factualSummary;
              breakdown = parsed.breakdown || breakdown;
            }
          }
        } catch (e) {
          console.error("AI breakdown generation failed:", e);
        }
      }

      const storyId = `crossfire-${cluster.map((a) => a.id).join("-")}`;
      const createdAt = cluster.map((a) => a.publishedAt).sort().reverse()[0];

      stories.push({ id: storyId, neutralHeadline, factualSummary, sources, breakdown, leanSpread, createdAt });
    }

    // Persist crossfire stories to DB
    try {
      const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

      for (const story of stories) {
        const { error: storyError } = await supabase.from('crossfire_stories').upsert({
          id: story.id,
          neutral_headline: story.neutralHeadline,
          factual_summary: story.factualSummary,
          breakdown: story.breakdown,
          lean_left: story.leanSpread.left,
          lean_center: story.leanSpread.center,
          lean_right: story.leanSpread.right,
          created_at: story.createdAt,
        }, { onConflict: 'id' });

        if (storyError) { console.error("Error persisting crossfire story:", storyError); continue; }

        // Delete old sources and re-insert
        await supabase.from('crossfire_story_sources').delete().eq('story_id', story.id);

        const sourceRows = story.sources.map(s => ({
          story_id: story.id,
          article_id: s.articleId,
          source: s.source,
          headline: s.headline,
          excerpt: s.excerpt,
          url: s.url,
          image_url: s.imageUrl,
          political_bias: s.politicalBias,
          published_at: s.publishedAt,
        }));

        const { error: srcError } = await supabase.from('crossfire_story_sources').insert(sourceRows);
        if (srcError) console.error("Error persisting crossfire sources:", srcError);
      }
    } catch (e) {
      console.error("Error persisting crossfire data:", e);
    }

    return new Response(JSON.stringify({ stories }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("CrossFire analyze error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze articles" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
