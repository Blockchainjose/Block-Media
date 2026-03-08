import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, RefreshCw, Grid, List, AlertCircle, ChevronDown, Flame } from "lucide-react";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { Button } from "./ui/button";
import { InterestSelector, type Interest } from "./InterestSelector";
import { TrendingBar } from "./feed/TrendingBar";
import { CryptoShareModal } from "./crypto/CryptoShareModal";
import { CrossFireCard } from "./crossfire/CrossFireCard";
import { useNews } from "@/hooks/useNews";
import { useCrossfireStories } from "@/hooks/useCrossfireStories";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AdSlot } from "@/components/ads/AdSlot";
import type { NewsArticle } from "@/types/article";

interface NewsFeedProps {
  selectedInterests: Interest[];
  onInterestChange: (interests: Interest[]) => void;
}

const ARTICLES_PER_PAGE = 6;
const IN_FEED_AD_INTERVAL = 8;

export function NewsFeed({ selectedInterests, onInterestChange }: NewsFeedProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [biasFilter, setBiasFilter] = useState<"all" | "left" | "center" | "right">("all");
  const [showCrossFireOnly, setShowCrossFireOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const [shareArticle, setShareArticle] = useState<NewsArticle | null>(null);
  const { data: articles = [], isLoading, error, refetch, isRefetching } = useNews();
  const { data: crossfireStories = [] } = useCrossfireStories();
  const { saveArticle, isArticleSaved } = useSavedArticles();
  const { toast } = useToast();

  const filteredArticles = articles.filter((article) => {
    const matchesInterest =
      selectedInterests.length === 0 || selectedInterests.includes(article.category);
    const matchesBias = biasFilter === "all" || article.politicalBias === biasFilter;
    return matchesInterest && matchesBias;
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const toggleInterest = (interest: Interest) => {
    onInterestChange(
      selectedInterests.includes(interest)
        ? selectedInterests.filter((i) => i !== interest)
        : [...selectedInterests, interest]
    );
    setVisibleCount(ARTICLES_PER_PAGE); // Reset on filter change
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ARTICLES_PER_PAGE);
  };

  const handleSave = (article: NewsArticle) => {
    if (isArticleSaved(article.url)) {
      toast({
        title: "Already saved",
        description: "This article is already in your saved list",
      });
      return;
    }
    saveArticle.mutate(article);
  };

  const handleShare = (article: NewsArticle) => {
    setShareArticle(article);
  };

  return (
    <section id="feed" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Trending Bar */}
        {!isLoading && articles.length > 0 && (
          <TrendingBar articles={articles.slice(0, 5)} />
        )}

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
            {/* CrossFire + Bias filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={showCrossFireOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowCrossFireOnly(!showCrossFireOnly);
                  setVisibleCount(ARTICLES_PER_PAGE);
                }}
                className={showCrossFireOnly ? "crossfire-badge border-0" : ""}
              >
                <Flame className="w-4 h-4 mr-1" />
                CrossFire
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Perspective:</span>
              {(["all", "left", "center", "right"] as const).map((bias) => (
                <Button
                  key={bias}
                  variant={biasFilter === bias ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setBiasFilter(bias);
                    setVisibleCount(ARTICLES_PER_PAGE);
                  }}
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
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load news articles. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* CrossFire-only mode */}
        {showCrossFireOnly && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crossfireStories.length > 0 ? (
              crossfireStories.map((story) => (
                <CrossFireCard key={story.id} story={story} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Flame className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground">No CrossFire stories available right now</p>
              </div>
            )}
          </div>
        )}

        {/* CrossFire highlights in normal feed */}
        {!showCrossFireOnly && !isLoading && crossfireStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">CrossFire Stories</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crossfireStories.slice(0, 3).map((story) => (
                <CrossFireCard key={story.id} story={story} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <>
            <div className="mb-8">
              <NewsCardSkeleton featured />
            </div>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {[...Array(5)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Featured article with link to article page */}
        {!isLoading && !showCrossFireOnly && visibleArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Link to={`/article/${visibleArticles[0].id}`} className="block">
              <NewsCard 
                article={visibleArticles[0]} 
                featured 
                isSaved={isArticleSaved(visibleArticles[0].url)}
                onSave={() => handleSave(visibleArticles[0])}
                onShare={() => handleShare(visibleArticles[0])}
              />
            </Link>
          </motion.div>
        )}

        {/* Articles grid */}
        {!isLoading && !showCrossFireOnly && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {visibleArticles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/article/${article.id}`} className="block h-full">
                  <NewsCard 
                    article={article} 
                    isSaved={isArticleSaved(article.url)}
                    onSave={() => handleSave(article)}
                    onShare={() => handleShare(article)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && !showCrossFireOnly && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="min-w-[200px]"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Load More Articles
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {visibleArticles.length} of {filteredArticles.length} articles
            </p>
          </motion.div>
        )}

        {!isLoading && !error && filteredArticles.length === 0 && (
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

      {/* Share Modal */}
      {shareArticle && (
        <CryptoShareModal
          open={!!shareArticle}
          onOpenChange={(open) => { if (!open) setShareArticle(null); }}
          article={{
            id: shareArticle.id,
            title: shareArticle.title,
            url: shareArticle.url,
            centerPerspective: shareArticle.centerPerspective,
            leftPerspective: shareArticle.leftPerspective,
            rightPerspective: shareArticle.rightPerspective,
            summary: shareArticle.aiSummary,
          }}
        />
      )}
    </section>
  );
}
