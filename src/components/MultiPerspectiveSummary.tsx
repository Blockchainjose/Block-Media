import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PerspectiveSummary {
  leftPerspective?: string;
  rightPerspective?: string;
  centerPerspective?: string;
}

interface MultiPerspectiveSummaryProps {
  perspectives: PerspectiveSummary;
  compact?: boolean;
}

export function MultiPerspectiveSummary({ perspectives, compact = false }: MultiPerspectiveSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const { leftPerspective, rightPerspective, centerPerspective } = perspectives;

  if (!leftPerspective && !rightPerspective && !centerPerspective) {
    return null;
  }

  const summaries = [
    { label: "Left View", content: leftPerspective, color: "border-l-blue-500 bg-blue-500/5" },
    { label: "Right View", content: rightPerspective, color: "border-l-primary bg-primary/5" },
    { label: "Common Ground", content: centerPerspective, color: "border-l-muted-foreground bg-muted/30", highlight: true },
  ].filter(s => s.content);

  if (compact && !expanded) {
    // Show only center/common ground in compact mode
    const centerSummary = summaries.find(s => s.highlight) || summaries[0];
    if (!centerSummary) return null;

    return (
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border-l-4 ${centerSummary.color}`}
        >
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {centerSummary.label}
          </p>
          <p className="text-sm line-clamp-2">{centerSummary.content}</p>
        </motion.div>
        {summaries.length > 1 && (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ChevronDown className="h-3 w-3" />
            View all perspectives
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {compact && (
        <button
          onClick={() => setExpanded(false)}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ChevronUp className="h-3 w-3" />
          Show less
        </button>
      )}
      {summaries.map((summary, index) => (
        <motion.div
          key={summary.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-3 rounded-lg border-l-4 ${summary.color} ${
            summary.highlight ? "ring-1 ring-primary/20" : ""
          }`}
        >
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
            {summary.label}
          </p>
          <p className="text-sm">{summary.content}</p>
        </motion.div>
      ))}
    </div>
  );
}
