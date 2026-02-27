import type { NewsArticle } from "./article";

export interface CrossFireSource {
  articleId: string;
  source: string;
  headline: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  politicalBias: "left" | "center" | "right";
  publishedAt: string;
}

export interface CrossFireStory {
  id: string;
  neutralHeadline: string;
  factualSummary: string;
  sources: CrossFireSource[];
  breakdown: string;
  leanSpread: { left: number; center: number; right: number };
  createdAt: string;
}

export function isCrossFireEligible(articles: NewsArticle[]): boolean {
  const biases = new Set(articles.map((a) => a.politicalBias));
  return articles.length >= 2 && biases.size >= 2;
}
