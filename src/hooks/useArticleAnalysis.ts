import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase.functions.invoke("analyze-article", {
        body: { title, content, source },
      });

      if (error) {
        console.error("Error analyzing article:", error);
        return null;
      }

      return data as ArticleAnalysis;
    } catch (error) {
      console.error("Analysis failed:", error);
      return null;
    } finally {
      setAnalyzing(prev => ({ ...prev, [articleId]: false }));
    }
  }, []);

  return { analyzeArticle, analyzing };
}
