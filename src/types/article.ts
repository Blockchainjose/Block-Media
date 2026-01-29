import type { BiasPercentages } from "@/components/ui/BiasIndicator";

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
  category: "crypto" | "global_markets" | "commodities";
  aiSummary: string;
  politicalBias: "left" | "center" | "right";
  biasPercentages: BiasPercentages;
  balancedSummary: string;
  leftPerspective?: string;
  rightPerspective?: string;
  centerPerspective?: string;
}

export interface ArticleAnalysis {
  biasPercentages: BiasPercentages;
  leftPerspective: string;
  rightPerspective: string;
  centerPerspective: string;
  aiSummary: string;
}
