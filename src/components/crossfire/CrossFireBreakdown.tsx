import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface CrossFireBreakdownProps {
  breakdown: string;
}

export function CrossFireBreakdown({ breakdown }: CrossFireBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border-2 border-primary/20 bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg">The Breakdown</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{breakdown}</p>
    </motion.div>
  );
}
