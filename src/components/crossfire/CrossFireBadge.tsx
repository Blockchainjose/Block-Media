import { Flame } from "lucide-react";

interface CrossFireBadgeProps {
  size?: "sm" | "md";
}

export function CrossFireBadge({ size = "sm" }: CrossFireBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full crossfire-badge ${sizeClasses}`}
    >
      <Flame className={iconSize} />
      CrossFire
    </span>
  );
}
