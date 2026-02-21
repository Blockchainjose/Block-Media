import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  reputation: number;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile | null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { display_name?: string; avatar_url?: string; bio?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
