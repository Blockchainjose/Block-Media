import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { AssetCard } from "@/components/charts/AssetCard";
import { CryptoNewsCard } from "@/components/crypto/CryptoNewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQuotes } from "@/hooks/useQuotes";
import { useCryptoNews, type CryptoNewsArticle } from "@/hooks/useCryptoNews";
import { Bitcoin, Newspaper, BarChart3, Scale, Layers, Box } from "lucide-react";

const CRYPTO_SYMBOLS = ["BTC", "ETH", "SOL"];

const newsCategories = [
  { value: "all", label: "All News", icon: Newspaper },
  { value: "price", label: "Price", icon: BarChart3 },
  { value: "regulation", label: "Regulation", icon: Scale },
  { value: "protocol", label: "Protocol", icon: Layers },
  { value: "blockchain", label: "Blockchain", icon: Box },
];

export default function Crypto() {
  const { data: quotes, isLoading: quotesLoading } = useQuotes();
  const { data: news, isLoading: newsLoading } = useCryptoNews();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const cryptoQuotes = quotes?.filter((q) => CRYPTO_SYMBOLS.includes(q.displaySymbol)) || [];

  const filteredNews = news?.filter((article: CryptoNewsArticle) => {
    if (activeCategory === "all") return true;
    return article.category === activeCategory;
  }) || [];

  // Get category counts
  const categoryCounts = news?.reduce((acc: Record<string, number>, article: CryptoNewsArticle) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PriceTicker />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bitcoin className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Crypto <span className="text-gradient">Hub</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real-time cryptocurrency prices, charts, and comprehensive news coverage including 
              regulations, protocol updates, and blockchain developments.
            </p>
          </motion.div>

          {/* Price Cards */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Live Prices</h2>
            {quotesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[250px]" />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {cryptoQuotes.map((quote) => (
                  <motion.div
                    key={quote.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AssetCard quote={quote} days={30} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

          {/* News Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Latest Crypto News</h2>
              
              {/* Category Stats */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                {newsCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={activeCategory} className="mt-6">
                {newsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-[140px]" />
                    ))}
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No news articles found for this category.
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {filteredNews.map((article: CryptoNewsArticle) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CryptoNewsCard article={article} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
