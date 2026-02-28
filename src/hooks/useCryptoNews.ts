import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CryptoNewsArticle {
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

export function useCryptoNews() {
  return useQuery({
    queryKey: ["crypto-news"],
    queryFn: async (): Promise<CryptoNewsArticle[]> => {
      const { data, error } = await supabase.functions.invoke("fetch-crypto-news");
      if (error) { console.error("Error fetching crypto news:", error); throw error; }
      return data?.articles || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useCryptoArticleById(id: string | undefined) {
  return useQuery({
    queryKey: ["crypto-article", id],
    queryFn: async (): Promise<CryptoNewsArticle | null> => {
      const { data, error } = await supabase
        .from("news_articles" as any)
        .select("*")
        .eq("id", id!)
        .maybeSingle();

      if (error || !data) return null;
      const r = data as any;
      return {
        id: r.id,
        title: r.title,
        source: r.source,
        url: r.url,
        imageUrl: r.image_url || "",
        publishedAt: r.published_at,
        summary: r.ai_summary || "",
        category: r.category || "general",
        relatedSymbols: r.related_symbols || [],
      };
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
