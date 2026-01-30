import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Quote {
  symbol: string;
  displaySymbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async (): Promise<Quote[]> => {
      const { data, error } = await supabase.functions.invoke("fetch-quotes");

      if (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }

      return data?.quotes || [];
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}
