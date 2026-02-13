import { motion } from "framer-motion";
import { ExternalLink, Bookmark, BookmarkCheck, Share2, Clock, Sparkles, Loader2 } from "lucide-react";
import { BiasPercentageBar, type BiasPercentages } from "./ui/BiasIndicator";
import { MultiPerspectiveSummary } from "./MultiPerspectiveSummary";
import { Button } from "./ui/button";
import { useState } from "react";
import { useArticleAnalysis } from "@/hooks/useArticleAnalysis";
import type { NewsArticle } from "@/types/article";

interface NewsCardProps {
  article: NewsArticle;
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  featured?: boolean;
}

export function NewsCard({ article, onSave, onShare, isSaved = false, featured = false }: NewsCardProps) {
  const timeAgo = getTimeAgo(article.publishedAt);
  const { analyzeArticle, analyzing } = useArticleAnalysis();
  const [localArticle, setLocalArticle] = useState(article);
  const isAnalyzing = analyzing[article.id];

  const handleAnalyze = async () => {
    const analysis = await analyzeArticle(
      article.id,
      article.title,
      article.aiSummary,
      article.source
    );
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

  const hasAnalysis = localArticle.leftPerspective || localArticle.rightPerspective || localArticle.centerPerspective;

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="news-card relative group rounded-2xl overflow-hidden bg-card border border-border"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={localArticle.imageUrl}
              alt={localArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
            
            {/* Source badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
              {localArticle.source}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {timeAgo}
              </span>
            </div>

            <h2 className="text-2xl font-display font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">
              {localArticle.title}
            </h2>

            {/* Bias Percentage Bar */}
            <div className="mb-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">Bias Analysis</p>
                {!hasAnalysis && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAnalyze(); }}
                    disabled={isAnalyzing}
                    className="h-7 text-xs"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    AI Analyze
                  </Button>
                )}
              </div>
              <BiasPercentageBar percentages={localArticle.biasPercentages} size="md" />
            </div>

            {/* Multi-perspective summaries */}
            {hasAnalysis ? (
              <div className="mb-4">
                <MultiPerspectiveSummary
                  perspectives={{
                    leftPerspective: localArticle.leftPerspective,
                    rightPerspective: localArticle.rightPerspective,
                    centerPerspective: localArticle.centerPerspective,
                  }}
                />
              </div>
            ) : (
              <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium text-primary mb-2">AI Summary</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{localArticle.aiSummary}</p>
              </div>
            )}

            <div className="mt-auto flex items-center gap-2">
              <Button variant="default" className="btn-glow flex-1" asChild>
                <a href={localArticle.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant={isSaved ? "secondary" : "outline"} size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave?.(); }}>
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare?.(); }}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="news-card group rounded-xl overflow-hidden bg-card border border-border"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={localArticle.imageUrl}
          alt={localArticle.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Source badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
          {localArticle.source}
        </div>

        {/* AI Analyze button */}
        {!hasAnalysis && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAnalyze(); }}
            disabled={isAnalyzing}
            className="absolute top-3 right-3 h-7 text-xs bg-background/80 backdrop-blur-sm"
          >
            {isAnalyzing ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3 mr-1" />
            )}
            Analyze
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>

        <h3 className="font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {localArticle.title}
        </h3>

        {/* Bias Percentage Bar for non-featured cards */}
        <div className="mb-3">
          <BiasPercentageBar percentages={localArticle.biasPercentages} size="sm" showLabels={false} />
        </div>

        {/* Show multi-perspective if analyzed, otherwise show basic summary */}
        {hasAnalysis ? (
          <div className="mb-4">
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
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{localArticle.aiSummary}</p>
        )}

        <div className="flex items-center justify-between">
          <a
            href={localArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Read more
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="flex items-center gap-1">
            <Button variant={isSaved ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave?.(); }}>
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare?.(); }}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Re-export NewsArticle type for backwards compatibility
export type { NewsArticle };
