import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { CrossFireBadge } from "./CrossFireBadge";
import { CrossFireLeanMeter } from "./CrossFireLeanMeter";
import type { CrossFireStory } from "@/types/crossfire";

interface CrossFireCardProps {
  story: CrossFireStory;
}

export function CrossFireCard({ story }: CrossFireCardProps) {
  const timeAgo = getTimeAgo(story.createdAt);

  return (
    <Link to={`/crossfire/${encodeURIComponent(story.id)}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="crossfire-card group rounded-xl overflow-hidden bg-card border-2 border-primary/30 relative"
      >
        {/* Split-color top border */}
        <div className="flex h-1">
          <div className="flex-1 bg-[hsl(var(--bias-left))]" />
          <div className="flex-1 bg-[hsl(var(--bias-center))]" />
          <div className="flex-1 bg-[hsl(var(--bias-right))]" />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <CrossFireBadge />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {story.neutralHeadline}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {story.factualSummary}
          </p>

          <CrossFireLeanMeter leanSpread={story.leanSpread} />

          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {story.sources.slice(0, 4).map((s) => (
                <div
                  key={s.articleId}
                  className={`w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold ${
                    s.politicalBias === "left"
                      ? "bg-[hsl(var(--bias-left))]"
                      : s.politicalBias === "right"
                      ? "bg-[hsl(var(--bias-right))]"
                      : "bg-[hsl(var(--bias-center))]"
                  } text-white`}
                >
                  {s.source.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
              Compare Coverage
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function getTimeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
