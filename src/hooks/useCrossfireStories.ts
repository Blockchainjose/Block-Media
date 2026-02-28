import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNews } from "./useNews";
import type { CrossFireStory } from "@/types/crossfire";

export function useCrossfireStories() {
  const { data: articles = [], isLoading: newsLoading } = useNews();

  return useQuery({
    queryKey: ["crossfire-stories", articles.map((a) => a.id).join(",")],
    queryFn: async (): Promise<CrossFireStory[]> => {
      if (articles.length < 2) return [];

      const payload = articles.map((a) => ({
        id: a.id,
        title: a.title,
        source: a.source,
        aiSummary: a.aiSummary,
        url: a.url,
        imageUrl: a.imageUrl,
        politicalBias: a.politicalBias,
        publishedAt: a.publishedAt,
      }));

      const { data, error } = await supabase.functions.invoke("crossfire-analyze", {
        body: { articles: payload },
      });

      if (error) {
        console.error("CrossFire analyze error:", error);
        throw error;
      }

      return data?.stories || [];
    },
    enabled: !newsLoading && articles.length >= 2,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useCrossfireStoryById(id: string | undefined) {
  return useQuery({
    queryKey: ["crossfire-story", id],
    queryFn: async (): Promise<CrossFireStory | null> => {
      // Fetch story
      const { data: storyData, error: storyError } = await supabase
        .from("crossfire_stories" as any)
        .select("*")
        .eq("id", id!)
        .maybeSingle();

      if (storyError || !storyData) return null;
      const s = storyData as any;

      // Fetch sources
      const { data: sourcesData, error: srcError } = await supabase
        .from("crossfire_story_sources" as any)
        .select("*")
        .eq("story_id", id!);

      const sources = (srcError || !sourcesData) ? [] : (sourcesData as any[]).map(r => ({
        articleId: r.article_id,
        source: r.source,
        headline: r.headline,
        excerpt: r.excerpt,
        url: r.url,
        imageUrl: r.image_url,
        politicalBias: r.political_bias,
        publishedAt: r.published_at,
      }));

      return {
        id: s.id,
        neutralHeadline: s.neutral_headline,
        factualSummary: s.factual_summary,
        sources,
        breakdown: s.breakdown,
        leanSpread: { left: s.lean_left, center: s.lean_center, right: s.lean_right },
        createdAt: s.created_at,
      };
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
