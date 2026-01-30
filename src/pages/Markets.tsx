import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { AssetCard } from "@/components/charts/AssetCard";
import { SEOHead } from "@/components/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuotes } from "@/hooks/useQuotes";
import { TrendingUp, BarChart3, DollarSign } from "lucide-react";

const INDEX_SYMBOLS = ["S&P 500", "NASDAQ", "DOW"];
const STOCK_SYMBOLS = ["PLTR", "CRWV", "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"];
const CRYPTO_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "BNB"];
const COMMODITY_SYMBOLS = ["Gold", "Silver", "Platinum", "Crude", "Copper"];

export default function Markets() {
  const { data: quotes, isLoading } = useQuotes();
  const [activeTab, setActiveTab] = useState("all");

  const filterQuotes = (symbols: string[]) => {
    if (!quotes) return [];
    return quotes.filter((q) => symbols.includes(q.displaySymbol));
  };

  const indexQuotes = filterQuotes(INDEX_SYMBOLS);
  const stockQuotes = filterQuotes(STOCK_SYMBOLS);
  const cryptoQuotes = filterQuotes(CRYPTO_SYMBOLS);
  const commodityQuotes = filterQuotes(COMMODITY_SYMBOLS);

  const getDisplayQuotes = () => {
    switch (activeTab) {
      case "indices":
        return indexQuotes;
      case "stocks":
        return stockQuotes;
      case "crypto":
        return cryptoQuotes;
      case "commodities":
        return commodityQuotes;
      default:
        return quotes || [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Market Overview - Live Stock, Crypto & Commodity Prices"
        description="Track real-time prices and historical charts for S&P 500, NASDAQ, DOW, Bitcoin, Ethereum, XRP, Gold, Silver, Platinum, Copper and more. Live market data updated every minute."
        keywords="stock prices, S&P 500, NASDAQ, DOW Jones, Bitcoin price, Ethereum price, XRP, Gold price, Silver price, market data, live quotes"
        canonicalPath="/markets"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Market <span className="text-gradient">Overview</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track real-time prices and historical performance of major indices, stocks, 
              cryptocurrencies, and commodities all in one place.
            </p>
          </motion.header>

          {/* Category Tabs */}
          <nav aria-label="Market categories">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="indices" className="flex items-center gap-1 text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Indices
              </TabsTrigger>
              <TabsTrigger value="stocks" className="flex items-center gap-1 text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Stocks
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center gap-1 text-xs sm:text-sm">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                Crypto
              </TabsTrigger>
              <TabsTrigger value="commodities" className="flex items-center gap-1 text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Metals
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[250px]" />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {getDisplayQuotes().map((quote) => (
                    <motion.div
                      key={quote.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AssetCard quote={quote} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
          </nav>

          {/* Market Summary Stats */}
          {!isLoading && quotes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Major Indices</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {indexQuotes.filter((q) => q.change > 0).length}/{indexQuotes.length}
                  </span>
                  <span className="text-muted-foreground">indices up today</span>
                </div>
              </div>
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Stocks & Crypto</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {[...stockQuotes, ...cryptoQuotes].filter((q) => q.change > 0).length}/{stockQuotes.length + cryptoQuotes.length}
                  </span>
                  <span className="text-muted-foreground">assets up today</span>
                </div>
              </div>
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Commodities</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {commodityQuotes.filter((q) => q.change > 0).length}/{commodityQuotes.length}
                  </span>
                  <span className="text-muted-foreground">assets up today</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
