import { motion } from "framer-motion";

interface BiasIndicatorProps {
  bias: "left" | "center" | "right";
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function BiasIndicator({ bias, showLabel = true, size = "md" }: BiasIndicatorProps) {
  const biasConfig = {
    left: {
      label: "Left",
      colorClass: "bias-left",
      position: "left-0",
    },
    center: {
      label: "Center",
      colorClass: "bias-center",
      position: "left-1/2 -translate-x-1/2",
    },
    right: {
      label: "Right",
      colorClass: "bias-right",
      position: "right-0",
    },
  };

  const config = biasConfig[bias];
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.colorClass} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${bias === "left" ? "bg-blue-400" : bias === "right" ? "bg-primary" : "bg-muted-foreground"}`} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </motion.div>
  );
}

export function BiasScale({ bias }: { bias: "left" | "center" | "right" }) {
  const positions = {
    left: "left-1",
    center: "left-1/2 -translate-x-1/2",
    right: "right-1",
  };

  return (
    <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-muted to-primary">
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg ${positions[bias]}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
