import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/types/article";

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-display font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/article/${article.id}`}
              className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  {getTimeAgo(article.publishedAt)}
                </span>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h3>
                <span className="text-xs text-primary flex items-center gap-1 mt-auto">
                  Read more
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
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
