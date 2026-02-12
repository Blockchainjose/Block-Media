import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Share2, Sparkles, Loader2 } from "lucide-react";
import { BiasPercentageBar, type BiasPercentages } from "@/components/ui/BiasIndicator";
import { MultiPerspectiveSummary } from "@/components/MultiPerspectiveSummary";
import { CryptoShareModal } from "@/components/crypto/CryptoShareModal";
import { useArticleAnalysis } from "@/hooks/useArticleAnalysis";
import type { CryptoNewsArticle } from "@/hooks/useCryptoNews";
import { formatDistanceToNow } from "date-fns";

interface CryptoNewsCardProps {
  article: CryptoNewsArticle;
}

const categoryColors: Record<CryptoNewsArticle["category"], string> = {
  price: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  regulation: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  protocol: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  blockchain: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  general: "bg-muted text-muted-foreground border-muted",
};

const categoryLabels: Record<CryptoNewsArticle["category"], string> = {
  price: "Price & Trading",
  regulation: "Regulation",
  protocol: "Protocol",
  blockchain: "Blockchain",
  general: "General",
};

interface EnrichedArticle extends CryptoNewsArticle {
  biasPercentages?: BiasPercentages;
  leftPerspective?: string;
  rightPerspective?: string;
  centerPerspective?: string;
  aiSummary?: string;
}

export function CryptoNewsCard({ article }: CryptoNewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const { analyzeArticle, analyzing } = useArticleAnalysis();
  const [localArticle, setLocalArticle] = useState<EnrichedArticle>(article);
  const [showShareModal, setShowShareModal] = useState(false);
  const isAnalyzing = analyzing[article.id];

  const hasAnalysis = !!(localArticle.leftPerspective || localArticle.rightPerspective || localArticle.centerPerspective);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const analysis = await analyzeArticle(
      article.id,
      article.title,
      article.summary,
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

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
      <Card className="overflow-hidden hover:border-primary/50 transition-colors group">
        <div className="flex flex-col md:flex-row">
          <Link to={`/crypto/${article.id}`} className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
              }}
            />
          </Link>
          <CardContent className="flex-1 p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={categoryColors[article.category]}>
                {categoryLabels[article.category]}
              </Badge>
              {article.relatedSymbols.slice(0, 3).map((symbol) => (
                <Badge key={symbol} variant="secondary" className="text-xs">
                  {symbol}
                </Badge>
              ))}
            </div>

            <Link to={`/crypto/${article.id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="font-semibold text-lg line-clamp-2 mb-2">{article.title}</h3>
            </Link>

            {/* Bias bar if analyzed */}
            {hasAnalysis && localArticle.biasPercentages && (
              <div className="mb-3">
                <BiasPercentageBar percentages={localArticle.biasPercentages} size="sm" showLabels={false} />
              </div>
            )}

            {/* Show multi-perspective if analyzed, otherwise summary */}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="h-7 text-xs"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    Analyze
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleShareClick} className="h-7 text-xs">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
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

      <CryptoShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        article={{
          id: article.id,
          title: article.title,
          url: article.url,
          centerPerspective: localArticle.centerPerspective,
          leftPerspective: localArticle.leftPerspective,
          rightPerspective: localArticle.rightPerspective,
          summary: article.summary,
        }}
      />
    </>
  );
}
