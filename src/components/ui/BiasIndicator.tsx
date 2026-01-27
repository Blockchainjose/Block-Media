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

export interface BiasPercentages {
  left: number;
  center: number;
  right: number;
}

interface BiasPercentageBarProps {
  percentages: BiasPercentages;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

export function BiasPercentageBar({ 
  percentages, 
  size = "md", 
  showLabels = true,
  className = "" 
}: BiasPercentageBarProps) {
  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const total = percentages.left + percentages.center + percentages.right;
  const normalizedLeft = (percentages.left / total) * 100;
  const normalizedCenter = (percentages.center / total) * 100;
  const normalizedRight = (percentages.right / total) * 100;

  // Determine dominant bias
  const dominant = 
    normalizedLeft >= normalizedCenter && normalizedLeft >= normalizedRight
      ? "left"
      : normalizedRight >= normalizedCenter
      ? "right"
      : "center";

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Labels row */}
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Left {Math.round(normalizedLeft)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Center {Math.round(normalizedCenter)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Right {Math.round(normalizedRight)}%
          </span>
        </div>
      )}
      
      {/* Bar */}
      <div className={`relative w-full ${heights[size]} rounded-full overflow-hidden bg-muted/30 flex`}>
        {/* Left section */}
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedLeft}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
        />
        
        {/* Center section */}
        <motion.div
          className="h-full bg-muted-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedCenter}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
        
        {/* Right section */}
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedRight}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      {/* Dominant indicator */}
      <div className="flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            dominant === "left"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : dominant === "right"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          Leans {dominant.charAt(0).toUpperCase() + dominant.slice(1)}
        </motion.span>
      </div>
    </div>
  );
}
