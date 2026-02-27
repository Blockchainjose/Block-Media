import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Sparkles, Loader2 } from "lucide-react";
import { BiasPercentageBar, type BiasPercentages } from "@/components/ui/BiasIndicator";
import { MultiPerspectiveSummary } from "@/components/MultiPerspectiveSummary";
import { useArticleAnalysis } from "@/hooks/useArticleAnalysis";
import type { PolicyNewsArticle } from "@/hooks/usePolicyNews";
import { formatDistanceToNow } from "date-fns";

interface PolicyNewsCardProps {
  article: PolicyNewsArticle;
}

const categoryColors: Record<PolicyNewsArticle["category"], string> = {
  federal_reserve: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  trade_policy: "bg-red-500/10 text-red-500 border-red-500/30",
  fiscal_policy: "bg-green-500/10 text-green-500 border-green-500/30",
  labor_market: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  housing: "bg-teal-500/10 text-teal-500 border-teal-500/30",
  regulation: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  international: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  general: "bg-muted text-muted-foreground border-muted",
};

const categoryLabels: Record<PolicyNewsArticle["category"], string> = {
  federal_reserve: "Federal Reserve",
  trade_policy: "Trade Policy",
  fiscal_policy: "Fiscal Policy",
  labor_market: "Labor Market",
  housing: "Housing",
  regulation: "Regulation",
  international: "International",
  general: "General",
};

const biasColors: Record<string, string> = {
  left: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  center: "bg-muted text-muted-foreground border-muted",
  right: "bg-red-500/10 text-red-400 border-red-500/30",
};

interface EnrichedArticle extends PolicyNewsArticle {
  biasPercentages?: BiasPercentages;
  leftPerspective?: string;
  rightPerspective?: string;
  centerPerspective?: string;
  aiSummary?: string;
}

export function PolicyNewsCard({ article }: PolicyNewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const { analyzeArticle, analyzing } = useArticleAnalysis();
  const [localArticle, setLocalArticle] = useState<EnrichedArticle>(article);
  const isAnalyzing = analyzing[article.id];

  const hasAnalysis = !!(localArticle.leftPerspective || localArticle.rightPerspective || localArticle.centerPerspective);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const analysis = await analyzeArticle(article.id, article.title, article.summary, article.source);
    if (analysis) {
      setLocalArticle({
        ...localArticle,
        biasPercentages: analysis.biasPercentages,
        aiSummary: analysis.aiSummary,
        leftPerspective: analysis.leftPerspective,
        rightPerspective: analysis.rightPerspective,
        centerPerspective: analysis.centerPerspective,
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop";
            }}
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={categoryColors[article.category]}>
              {categoryLabels[article.category]}
            </Badge>
            <Badge variant="outline" className={biasColors[article.politicalBias]}>
              {article.politicalBias.charAt(0).toUpperCase() + article.politicalBias.slice(1)}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {hasAnalysis && localArticle.biasPercentages && (
            <div className="mb-3">
              <BiasPercentageBar percentages={localArticle.biasPercentages} size="sm" showLabels={false} />
            </div>
          )}

          {hasAnalysis ? (
            <div className="mb-3">
              <MultiPerspectiveSummary
                perspectives={{
                  leftPerspective: localArticle.leftPerspective,
                  rightPerspective: localArticle.rightPerspective,
                  centerPerspective: localArticle.centerPerspective,
                }}
                compact
              />
            </div>
          ) : (
            article.summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
            )
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">{article.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {!hasAnalysis && (
                <Button variant="ghost" size="sm" onClick={handleAnalyze} disabled={isAnalyzing} className="h-7 text-xs">
                  {isAnalyzing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  Analyze
                </Button>
              )}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors ml-1"
                onClick={(e) => e.stopPropagation()}
              >
                Read <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
