import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdSlot {
  id: string;
  slot_key: string;
  name: string;
  slot_type: string;
  ad_code: string | null;
  is_active: boolean;
  display_rules: Record<string, any>;
  fallback_type: string | null;
  fallback_image_url: string | null;
  fallback_link: string | null;
  size_desktop: string | null;
  size_mobile: string | null;
}

export interface SponsorBanner {
  id: string;
  slot_key: string;
  title: string;
  image_url: string | null;
  link_url: string;
  is_active: boolean;
  display_start: string | null;
  display_end: string | null;
  display_order: number;
  label: string | null;
}

export function useAdSlots() {
  return useQuery({
    queryKey: ["ad-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_slots")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return (data || []) as AdSlot[];
    },
    staleTime: 60_000, // Cache for 1 min
  });
}

export function useAdSlot(slotKey: string) {
  const { data: slots } = useAdSlots();
  return slots?.find((s) => s.slot_key === slotKey) ?? null;
}

export function useSponsorBanners(slotKey?: string) {
  return useQuery({
    queryKey: ["sponsor-banners", slotKey],
    queryFn: async () => {
      let query = supabase
        .from("sponsor_banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (slotKey) query = query.eq("slot_key", slotKey);

      const { data, error } = await query;
      if (error) throw error;

      const now = new Date().toISOString();
      return ((data || []) as SponsorBanner[]).filter((b) => {
        if (b.display_start && b.display_start > now) return false;
        if (b.display_end && b.display_end < now) return false;
        return true;
      });
    },
    staleTime: 60_000,
  });
}
