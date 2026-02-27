import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PolicyNewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  summary: string;
  category: "federal_reserve" | "trade_policy" | "fiscal_policy" | "labor_market" | "housing" | "regulation" | "international" | "general";
  politicalBias: "left" | "center" | "right";
}

export function usePolicyNews() {
  return useQuery({
    queryKey: ["policy-news"],
    queryFn: async (): Promise<PolicyNewsArticle[]> => {
      const { data, error } = await supabase.functions.invoke("fetch-policy-news");

      if (error) {
        console.error("Error fetching policy news:", error);
        throw error;
      }

      return data?.articles || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}
