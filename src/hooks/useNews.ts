import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { NewsArticle } from "@/types/article";

async function fetchNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase.functions.invoke("fetch-news");

  if (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }

  return data?.articles || [];
}

async function fetchArticleById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from("news_articles" as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const r = data as any;
  return {
    id: r.id,
    title: r.title,
    source: r.source,
    imageUrl: r.image_url || "",
    url: r.url,
    publishedAt: r.published_at,
    category: r.category,
    aiSummary: r.ai_summary || "",
    politicalBias: r.political_bias || "center",
    biasPercentages: { left: r.bias_left || 33, center: r.bias_center || 34, right: r.bias_right || 33 },
    balancedSummary: r.balanced_summary || "",
    leftPerspective: r.left_perspective,
    rightPerspective: r.right_perspective,
    centerPerspective: r.center_perspective,
  };
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useArticleById(id: string | undefined) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id!),
    enabled: !!id,
    staleTime: Infinity,
  });
}
