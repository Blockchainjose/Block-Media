import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Flame } from "lucide-react";
import type { NewsArticle } from "@/types/article";

interface TrendingSidebarProps {
  articles: NewsArticle[];
  currentArticleId: string;
}

export function TrendingSidebar({ articles, currentArticleId }: TrendingSidebarProps) {
  // Get top 5 trending (excluding current article)
  const trendingArticles = articles
    .filter((a) => a.id !== currentArticleId)
    .slice(0, 5);

  return (
    <div className="sticky top-24">
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display font-bold text-lg">Trending Now</h3>
        </div>

        <div className="space-y-4">
          {trendingArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/article/${article.id}`}
                className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl font-display font-bold text-muted-foreground/50 group-hover:text-primary transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {article.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(article.publishedAt)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Category Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Explore Categories</h4>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/markets"
              className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Markets
            </Link>
            <Link
              to="/crypto"
              className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Crypto
            </Link>
            <Link
              to="/?category=commodities"
              className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Commodities
            </Link>
          </div>
        </div>
      </div>
    </div>
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
