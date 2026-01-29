import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type InterestCategory = "crypto" | "global_markets" | "commodities";

interface UserInterest {
  id: string;
  user_id: string;
  interest: InterestCategory;
  created_at: string;
}

export function useUserInterests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interests, isLoading, error } = useQuery({
    queryKey: ["user-interests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_interests")
        .select("*");

      if (error) throw error;
      return data as UserInterest[];
    },
  });

  const toggleInterest = useMutation({
    mutationFn: async (interest: InterestCategory) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      const existingInterest = interests?.find(i => i.interest === interest);

      if (existingInterest) {
        const { error } = await supabase
          .from("user_interests")
          .delete()
          .eq("id", existingInterest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_interests")
          .insert({ user_id: user.id, interest });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating interests",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const hasInterest = (interest: InterestCategory) => {
    return interests?.some(i => i.interest === interest) ?? false;
  };

  return {
    interests,
    isLoading,
    error,
    toggleInterest,
    hasInterest,
  };
}
