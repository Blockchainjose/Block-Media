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
