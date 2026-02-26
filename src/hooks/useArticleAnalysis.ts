import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ArticleAnalysis } from "@/types/article";

export function useArticleAnalysis() {
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});

  const analyzeArticle = useCallback(async (
    articleId: string,
    title: string,
    content: string,
    source: string
  ): Promise<ArticleAnalysis | null> => {
    setAnalyzing(prev => ({ ...prev, [articleId]: true }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to use AI analysis");
        return null;
      }

      const { data, error } = await supabase.functions.invoke("analyze-article", {
        body: { title, content, source },
      });

      if (error) {
        console.error("Error analyzing article:", error);
        toast.error("Analysis failed. Please try again.");
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      return data as ArticleAnalysis;
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed. Please try again.");
      return null;
    } finally {
      setAnalyzing(prev => ({ ...prev, [articleId]: false }));
    }
  }, []);

  return { analyzeArticle, analyzing };
}
