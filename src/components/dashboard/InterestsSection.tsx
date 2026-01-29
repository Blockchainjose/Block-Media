import { motion } from "framer-motion";
import { Bitcoin, Globe, Gem, Check } from "lucide-react";
import { useUserInterests } from "@/hooks/useUserInterests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const interestOptions = [
  {
    id: "crypto" as const,
    label: "Cryptocurrency",
    description: "Bitcoin, Ethereum, DeFi, and blockchain news",
    icon: Bitcoin,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "global_markets" as const,
    label: "Global Markets",
    description: "Stocks, bonds, forex, and economic indicators",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "commodities" as const,
    label: "Commodities",
    description: "Gold, oil, agriculture, and precious metals",
    icon: Gem,
    color: "from-emerald-500 to-green-500",
  },
];

export function InterestsSection() {
  const { interests, isLoading, toggleInterest, hasInterest } = useUserInterests();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Your Interests</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-display font-bold">Your Interests</h2>
        <p className="text-muted-foreground mt-1">
          Select topics to personalize your news feed
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {interestOptions.map((option, index) => {
          const isSelected = hasInterest(option.id);
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => toggleInterest.mutate(option.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 rounded-full bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="mt-3">{option.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{option.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {interests && interests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {interests.length} interest{interests.length !== 1 ? "s" : ""} selected
            </span>{" "}
            — Your feed will prioritize articles matching these topics
          </p>
        </motion.div>
      )}
    </div>
  );
}
