import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { NewsArticle } from "@/types/article";
import { useToast } from "@/hooks/use-toast";

interface SavedArticle {
  id: string;
  article_title: string;
  article_url: string;
  article_source: string | null;
  article_image_url: string | null;
  ai_summary: string | null;
  balanced_summary: string | null;
  political_bias: "left" | "center" | "right" | null;
  created_at: string;
  user_id: string;
}

export function useSavedArticles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedArticles, isLoading, error } = useQuery({
    queryKey: ["saved-articles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("saved_articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavedArticle[];
    },
  });

  const saveArticle = useMutation({
    mutationFn: async (article: NewsArticle) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to save articles");

      const { error } = await supabase.from("saved_articles").insert({
        user_id: user.id,
        article_title: article.title,
        article_url: article.url,
        article_source: article.source,
        article_image_url: article.imageUrl,
        ai_summary: article.aiSummary,
        balanced_summary: article.balancedSummary,
        political_bias: article.politicalBias,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-articles"] });
      toast({
        title: "Article saved",
        description: "You can view it in your dashboard",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving article",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const unsaveArticle = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from("saved_articles")
        .delete()
        .eq("id", articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-articles"] });
      toast({
        title: "Article removed",
        description: "Article removed from saved list",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing article",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const isArticleSaved = (articleUrl: string) => {
    return savedArticles?.some(a => a.article_url === articleUrl) ?? false;
  };

  return {
    savedArticles,
    isLoading,
    error,
    saveArticle,
    unsaveArticle,
    isArticleSaved,
  };
}
