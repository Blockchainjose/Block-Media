import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalData {
  symbol: string;
  candles: Candle[];
}

export function useHistoricalData(symbol: string, days: number = 30, resolution: string = "D") {
  return useQuery({
    queryKey: ["historical", symbol, days, resolution],
    queryFn: async (): Promise<HistoricalData> => {
      const { data, error } = await supabase.functions.invoke("fetch-historical", {
        body: { symbol, days, resolution },
      });

      if (error) {
        console.error("Error fetching historical data:", error);
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!symbol,
  });
}
