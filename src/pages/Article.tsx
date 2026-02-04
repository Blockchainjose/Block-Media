import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock, ArrowLeft, Bookmark, BookmarkCheck, Share2, ChevronUp, Sparkles, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { ArticleBreadcrumbs } from "@/components/article/ArticleBreadcrumbs";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { TrendingSidebar } from "@/components/article/TrendingSidebar";
import { ReadNextPrompt } from "@/components/article/ReadNextPrompt";
import { NewsletterCTA } from "@/components/article/NewsletterCTA";
import { BiasPercentageBar } from "@/components/ui/BiasIndicator";
import { MultiPerspectiveSummary } from "@/components/MultiPerspectiveSummary";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useArticleAnalysis } from "@/hooks/useArticleAnalysis";
import { useToast } from "@/hooks/use-toast";
import type { NewsArticle } from "@/types/article";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { data: articles = [], isLoading } = useNews();
  const { saveArticle, isArticleSaved } = useSavedArticles();
  const { analyzeArticle, analyzing } = useArticleAnalysis();
  const { toast } = useToast();
  const [showReadNext, setShowReadNext] = useState(false);
  const [localArticle, setLocalArticle] = useState<NewsArticle | null>(null);

  const article = articles.find((a) => a.id === id);

  useEffect(() => {
    if (article) {
      setLocalArticle(article);
    }
  }, [article]);

  // Track scroll position for Read Next prompt
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowReadNext(scrollPercent > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading || !localArticle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const timeAgo = getTimeAgo(localArticle.publishedAt);
  const isAnalyzing = analyzing[localArticle.id];
  const hasAnalysis = localArticle.leftPerspective || localArticle.rightPerspective || localArticle.centerPerspective;

  // Get related articles by same category
  const relatedArticles = articles
    .filter((a) => a.id !== localArticle.id && a.category === localArticle.category)
    .slice(0, 4);

  // Get next article for Read Next
  const currentIndex = articles.findIndex((a) => a.id === localArticle.id);
  const nextArticle = articles[currentIndex + 1] || articles[0];

  const handleAnalyze = async () => {
    const analysis = await analyzeArticle(
      localArticle.id,
      localArticle.title,
      localArticle.aiSummary,
      localArticle.source
    );
    if (analysis) {
      setLocalArticle({
        ...localArticle,
        biasPercentages: analysis.biasPercentages,
        aiSummary: analysis.aiSummary,
        leftPerspective: analysis.leftPerspective,
        rightPerspective: analysis.rightPerspective,
        centerPerspective: analysis.centerPerspective,
      });
    }
  };

  const handleSave = () => {
    if (isArticleSaved(localArticle.url)) {
      toast({
        title: "Already saved",
        description: "This article is already in your saved list",
      });
      return;
    }
    saveArticle.mutate(localArticle);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/article/${localArticle.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: localArticle.title,
          text: localArticle.aiSummary,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const categoryLabel = getCategoryLabel(localArticle.category);
  const articleUrl = `/article/${localArticle.id}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={localArticle.title}
        description={localArticle.aiSummary.slice(0, 160)}
        canonicalPath={articleUrl}
        type="article"
      />
      <ArticleSchema article={localArticle} url={articleUrl} />

      <Header />

      <main className="container mx-auto px-4 py-8">
        <ArticleBreadcrumbs category={localArticle.category} title={localArticle.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Back link */}
              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Link>

              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {timeAgo}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
                  {localArticle.title}
                </h1>

                <p className="text-muted-foreground">
                  Originally published by <span className="font-medium text-foreground">{localArticle.source}</span>
                </p>
              </header>

              {/* Featured Image */}
              <div className="relative rounded-xl overflow-hidden mb-8">
                <img
                  src={localArticle.imageUrl}
                  alt={localArticle.title}
                  className="w-full h-64 md:h-96 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Bias Analysis */}
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Political Bias Analysis</h2>
                  {!hasAnalysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      AI Deep Analysis
                    </Button>
                  )}
                </div>
                <BiasPercentageBar percentages={localArticle.biasPercentages} size="lg" />
              </section>

              {/* Multi-Perspective Summary */}
              {hasAnalysis ? (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Multi-Perspective Analysis</h2>
                  <MultiPerspectiveSummary
                    perspectives={{
                      leftPerspective: localArticle.leftPerspective,
                      rightPerspective: localArticle.rightPerspective,
                      centerPerspective: localArticle.centerPerspective,
                    }}
                  />
                </section>
              ) : (
                <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-lg font-semibold mb-3">AI Summary</h2>
                  <p className="text-muted-foreground leading-relaxed">{localArticle.aiSummary}</p>
                </section>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button className="btn-glow" asChild>
                  <a href={localArticle.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button
                  variant={isArticleSaved(localArticle.url) ? "secondary" : "outline"}
                  onClick={handleSave}
                >
                  {isArticleSaved(localArticle.url) ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isArticleSaved(localArticle.url) ? "Saved" : "Save Article"}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Newsletter CTA */}
              <NewsletterCTA />

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <RelatedArticles articles={relatedArticles} />
              )}
            </motion.div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <TrendingSidebar articles={articles} currentArticleId={localArticle.id} />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Read Next Prompt */}
      <AnimatePresence>
        {showReadNext && nextArticle && (
          <ReadNextPrompt article={nextArticle} />
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showReadNext && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-40"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    crypto: "Cryptocurrency",
    global_markets: "Global Markets",
    commodities: "Commodities",
  };
  return labels[category] || category;
}

export default Article;
