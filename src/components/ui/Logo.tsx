import { motion } from "framer-motion";
import { Logo3DCube } from "./Logo3DCube";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showCube?: boolean;
}

export function Logo({ className = "", size = "md", showCube = true }: LogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const cubeSizes = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const,
  };

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showCube && <Logo3DCube size={cubeSizes[size]} />}
      <div className={`font-display tracking-tight ${textSizes[size]}`}>
        <span className="font-bold text-foreground">BLOCK</span>
        <span className="font-light text-primary">MEDIA</span>
      </div>
    </motion.div>
  );
}
