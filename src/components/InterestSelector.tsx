import { motion } from "framer-motion";
import { TrendingUp, Globe, Coins, Check } from "lucide-react";

export type Interest = "crypto" | "global_markets" | "commodities";

interface InterestSelectorProps {
  selectedInterests: Interest[];
  onToggle: (interest: Interest) => void;
  variant?: "default" | "compact";
}

const interests = [
  {
    id: "crypto" as Interest,
    label: "Cryptocurrency",
    icon: Coins,
    description: "Bitcoin, Ethereum, DeFi & Web3",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "global_markets" as Interest,
    label: "Global Markets",
    icon: TrendingUp,
    description: "Stocks, Bonds & Indices",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "commodities" as Interest,
    label: "Commodities",
    icon: Globe,
    description: "Oil, Gold, Agriculture",
    color: "from-primary to-rose-500",
  },
];

export function InterestSelector({ selectedInterests, onToggle, variant = "default" }: InterestSelectorProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          return (
            <motion.button
              key={interest.id}
              onClick={() => onToggle(interest.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`interest-chip flex items-center gap-2 ${isSelected ? "active" : ""}`}
            >
              <interest.icon className="w-4 h-4" />
              <span>{interest.label}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1"
                >
                  <Check className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {interests.map((interest, index) => {
        const isSelected = selectedInterests.includes(interest.id);
        return (
          <motion.button
            key={interest.id}
            onClick={() => onToggle(interest.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group p-6 rounded-xl border transition-all duration-300 text-left ${
              isSelected
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:border-primary/50"
            }`}
            style={{
              boxShadow: isSelected ? "0 0 30px hsl(var(--primary) / 0.2)" : undefined,
            }}
          >
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}

            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${interest.color} p-2.5 mb-4`}>
              <interest.icon className="w-full h-full text-white" />
            </div>

            <h3 className="text-lg font-semibold mb-1">{interest.label}</h3>
            <p className="text-sm text-muted-foreground">{interest.description}</p>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${interest.color} opacity-5`} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
