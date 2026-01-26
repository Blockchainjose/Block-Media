import { motion } from "framer-motion";
import { ExternalLink, Bookmark, Share2, Clock } from "lucide-react";
import { BiasIndicator } from "./ui/BiasIndicator";
import { Button } from "./ui/button";

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
  balancedSummary: string;
}

interface NewsCardProps {
  article: NewsArticle;
  onSave?: () => void;
  onShare?: () => void;
  featured?: boolean;
}

export function NewsCard({ article, onSave, onShare, featured = false }: NewsCardProps) {
  const timeAgo = getTimeAgo(article.publishedAt);

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
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
            
            {/* Source badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
              {article.source}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <BiasIndicator bias={article.politicalBias} size="sm" />
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {timeAgo}
              </span>
            </div>

            <h2 className="text-2xl font-display font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">
              {article.title}
            </h2>

            <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-primary mb-2">AI Summary</p>
              <p className="text-sm text-muted-foreground line-clamp-3">{article.aiSummary}</p>
            </div>

            <div className="mt-auto flex items-center gap-2">
              <Button variant="default" className="btn-glow flex-1" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="icon" onClick={onSave}>
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onShare}>
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
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Source badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
          {article.source}
        </div>

        {/* Bias indicator */}
        <div className="absolute bottom-3 left-3">
          <BiasIndicator bias={article.politicalBias} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>

        <h3 className="font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.aiSummary}</p>

        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Read more
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSave}>
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShare}>
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
