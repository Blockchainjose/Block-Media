import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { NewsArticle } from "@/types/article";

interface TrendingBarProps {
  articles: NewsArticle[];
}

export function TrendingBar({ articles }: TrendingBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-4 rounded-xl bg-card border border-border overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium">Trending</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6 animate-marquee">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="flex items-center gap-2 flex-shrink-0 group"
              >
                <span className="text-xs text-muted-foreground">{index + 1}.</span>
                <span className="text-sm truncate max-w-[200px] md:max-w-[300px] group-hover:text-primary transition-colors">
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
