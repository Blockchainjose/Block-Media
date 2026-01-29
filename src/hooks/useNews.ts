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

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}
