import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { PolicyNewsCard } from "@/components/policy/PolicyNewsCard";
import { SEOHead } from "@/components/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { usePolicyNews, type PolicyNewsArticle } from "@/hooks/usePolicyNews";
import { Landmark, Newspaper, DollarSign, Handshake, Briefcase, Home, Scale, Globe } from "lucide-react";

const newsCategories = [
  { value: "all", label: "All", icon: Newspaper },
  { value: "federal_reserve", label: "Fed", icon: Landmark },
  { value: "trade_policy", label: "Trade", icon: Handshake },
  { value: "fiscal_policy", label: "Fiscal", icon: DollarSign },
  { value: "labor_market", label: "Labor", icon: Briefcase },
  { value: "housing", label: "Housing", icon: Home },
  { value: "regulation", label: "Regulation", icon: Scale },
  { value: "international", label: "International", icon: Globe },
];

export default function Policy() {
  const { data: news, isLoading } = usePolicyNews();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredNews = news?.filter((article: PolicyNewsArticle) => {
    if (activeCategory === "all") return true;
    return article.category === activeCategory;
  }) || [];

  const categoryCounts = news?.reduce((acc: Record<string, number>, article: PolicyNewsArticle) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Bias distribution
  const biasCounts = news?.reduce((acc: Record<string, number>, article: PolicyNewsArticle) => {
    acc[article.politicalBias] = (acc[article.politicalBias] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Economic Policy News - Federal Reserve, Trade, Tax & Regulation"
        description="Follow economic policy news: Federal Reserve decisions, trade policy, tariffs, tax legislation, labor market policy, housing regulation, and international economic agreements."
        keywords="federal reserve, monetary policy, tariffs, trade policy, tax bill, fiscal policy, regulation, antitrust, housing policy, interest rates, economic policy"
        canonicalPath="/policy"
      />

      <Header />
      <PriceTicker />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Landmark className="w-8 h-8 text-primary" aria-hidden="true" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Economic <span className="text-gradient">Policy</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Federal Reserve decisions, trade policy, tariffs, tax legislation, and regulation — 
              covered from every angle with AI-powered political lean analysis.
            </p>
          </motion.header>

          {/* Bias Distribution */}
          {!isLoading && news && news.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                Left: {biasCounts.left || 0}
              </Badge>
              <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">
                Center: {biasCounts.center || 0}
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                Right: {biasCounts.right || 0}
              </Badge>
            </motion.div>
          )}

          {/* News Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Latest Policy News</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category.replace("_", " ")}: {count}
                  </Badge>
                ))}
              </div>
            </div>

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
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-[140px]" />
                    ))}
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No policy news articles found for this category.
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {filteredNews.map((article: PolicyNewsArticle) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PolicyNewsCard article={article} />
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
