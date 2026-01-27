import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, RefreshCw, Grid, List } from "lucide-react";
import { NewsCard, type NewsArticle } from "./NewsCard";
import { Button } from "./ui/button";
import { InterestSelector, type Interest } from "./InterestSelector";

// Mock data for demonstration
const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Bitcoin Surges Past $100K as Institutional Adoption Accelerates",
    source: "CNBC",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop",
    url: "https://example.com/article-1",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "crypto",
    aiSummary: "Bitcoin reached a new all-time high above $100,000 as major financial institutions continue to increase their cryptocurrency holdings, signaling growing mainstream acceptance of digital assets.",
    politicalBias: "center",
    biasPercentages: { left: 25, center: 50, right: 25 },
    balancedSummary: "Both sides acknowledge the significance of institutional crypto adoption, though they differ on regulatory implications.",
  },
  {
    id: "2",
    title: "Federal Reserve Signals Potential Rate Cuts Amid Inflation Concerns",
    source: "WSJ",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    url: "https://example.com/article-2",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "global_markets",
    aiSummary: "The Federal Reserve indicated potential interest rate cuts in upcoming meetings as inflation shows signs of cooling, potentially boosting equity markets.",
    politicalBias: "left",
    biasPercentages: { left: 55, center: 30, right: 15 },
    balancedSummary: "While perspectives differ on the Fed's approach, economists agree that monetary policy will significantly impact 2025 markets.",
  },
  {
    id: "3",
    title: "Oil Prices Spike Following Middle East Supply Disruptions",
    source: "CNN",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop",
    url: "https://example.com/article-3",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    category: "commodities",
    aiSummary: "Crude oil prices jumped 5% following reports of supply disruptions in key Middle Eastern production facilities, raising concerns about global energy costs.",
    politicalBias: "right",
    biasPercentages: { left: 20, center: 25, right: 55 },
    balancedSummary: "The supply disruption highlights the ongoing debate between energy independence and international cooperation.",
  },
  {
    id: "4",
    title: "Ethereum 2.0 Upgrade Promises Enhanced Scalability and Lower Fees",
    source: "MSNBC",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop",
    url: "https://example.com/article-4",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    category: "crypto",
    aiSummary: "The upcoming Ethereum upgrade aims to dramatically reduce transaction costs and increase network throughput, potentially revolutionizing DeFi applications.",
    politicalBias: "center",
    biasPercentages: { left: 30, center: 45, right: 25 },
    balancedSummary: "Analysts across the spectrum recognize Ethereum's technological advancement while debating its long-term regulatory framework.",
  },
  {
    id: "5",
    title: "Gold Reaches Record High as Investors Seek Safe Haven Assets",
    source: "Fox News",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop",
    url: "https://example.com/article-5",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    category: "commodities",
    aiSummary: "Gold prices hit an all-time high as geopolitical uncertainties drive investors toward traditional safe-haven assets amid global market volatility.",
    politicalBias: "right",
    biasPercentages: { left: 15, center: 30, right: 55 },
    balancedSummary: "Both conservative and progressive analysts agree that gold's rally reflects broader economic uncertainty.",
  },
  {
    id: "6",
    title: "Asian Markets Rally on Strong Chinese Economic Data",
    source: "CNBC",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop",
    url: "https://example.com/article-6",
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    category: "global_markets",
    aiSummary: "Asian stock markets surged following better-than-expected Chinese manufacturing and services data, signaling a potential economic recovery.",
    politicalBias: "left",
    biasPercentages: { left: 50, center: 35, right: 15 },
    balancedSummary: "China's economic rebound has implications for global trade that both parties are watching closely.",
  },
];

interface NewsFeedProps {
  selectedInterests: Interest[];
  onInterestChange: (interests: Interest[]) => void;
}

export function NewsFeed({ selectedInterests, onInterestChange }: NewsFeedProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [biasFilter, setBiasFilter] = useState<"all" | "left" | "center" | "right">("all");

  const filteredArticles = mockArticles.filter((article) => {
    const matchesInterest =
      selectedInterests.length === 0 || selectedInterests.includes(article.category);
    const matchesBias = biasFilter === "all" || article.politicalBias === biasFilter;
    return matchesInterest && matchesBias;
  });

  const toggleInterest = (interest: Interest) => {
    onInterestChange(
      selectedInterests.includes(interest)
        ? selectedInterests.filter((i) => i !== interest)
        : [...selectedInterests, interest]
    );
  };

  return (
    <section id="feed" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Your Personalized <span className="text-gradient-red">News Feed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your interests to customize your feed. Each article includes AI summaries and political bias analysis.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 space-y-6"
        >
          <InterestSelector
            selectedInterests={selectedInterests}
            onToggle={toggleInterest}
            variant="compact"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Bias filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Perspective:</span>
              {(["all", "left", "center", "right"] as const).map((bias) => (
                <Button
                  key={bias}
                  variant={biasFilter === bias ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBiasFilter(bias)}
                  className={biasFilter === bias ? "btn-glow" : ""}
                >
                  {bias.charAt(0).toUpperCase() + bias.slice(1)}
                </Button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Featured article */}
        {filteredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <NewsCard article={filteredArticles[0]} featured />
          </motion.div>
        )}

        {/* Articles grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredArticles.slice(1).map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <NewsCard article={article} />
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground mb-4">No articles match your filters</p>
            <Button variant="outline" onClick={() => setBiasFilter("all")}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
