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

      if (error) {
        console.error("Error fetching crypto news:", error);
        throw error;
      }

      return data?.articles || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}
