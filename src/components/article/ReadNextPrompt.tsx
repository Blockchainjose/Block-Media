import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { NewsArticle } from "@/types/article";

interface ReadNextPromptProps {
  article: NewsArticle;
}

export function ReadNextPrompt({ article }: ReadNextPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 hidden sm:block"
          />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Read Next</p>
            <h4 className="font-medium text-sm sm:text-base line-clamp-1">
              {article.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button asChild className="btn-glow">
            <Link to={`/article/${article.id}`}>
              <span className="hidden sm:inline">Continue Reading</span>
              <span className="sm:hidden">Read</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDismissed(true)}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
