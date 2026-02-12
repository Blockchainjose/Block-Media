import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock, ArrowLeft, Share2, Sparkles, Loader2, ChevronUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { BiasPercentageBar, type BiasPercentages } from "@/components/ui/BiasIndicator";
import { MultiPerspectiveSummary } from "@/components/MultiPerspectiveSummary";
import { CryptoShareModal } from "@/components/crypto/CryptoShareModal";
import { NewsletterCTA } from "@/components/article/NewsletterCTA";
import { ReadNextPrompt } from "@/components/article/ReadNextPrompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCryptoNews, type CryptoNewsArticle } from "@/hooks/useCryptoNews";
import { useArticleAnalysis } from "@/hooks/useArticleAnalysis";
import { formatDistanceToNow } from "date-fns";

interface EnrichedCryptoArticle extends CryptoNewsArticle {
  biasPercentages?: BiasPercentages;
  leftPerspective?: string;
  rightPerspective?: string;
  centerPerspective?: string;
  aiSummary?: string;
}

const categoryLabels: Record<string, string> = {
  price: "Price & Trading",
  regulation: "Regulation",
  protocol: "Protocol",
  blockchain: "Blockchain",
  general: "General",
};

export default function CryptoArticle() {
  const { id } = useParams<{ id: string }>();
  const { data: articles = [], isLoading } = useCryptoNews();
  const { analyzeArticle, analyzing } = useArticleAnalysis();
  const [localArticle, setLocalArticle] = useState<EnrichedCryptoArticle | null>(null);
  const [showReadNext, setShowReadNext] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const article = articles.find((a) => a.id === id);

  useEffect(() => {
    if (article && !localArticle) {
      setLocalArticle({ ...article, biasPercentages: { left: 33, center: 34, right: 33 } });
    }
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowReadNext(pct > 70);
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(localArticle.publishedAt), { addSuffix: true });
  const isAnalyzing = analyzing[localArticle.id];
  const hasAnalysis = !!(localArticle.leftPerspective || localArticle.rightPerspective || localArticle.centerPerspective);

  const handleAnalyze = async () => {
    const analysis = await analyzeArticle(
      localArticle.id,
      localArticle.title,
      localArticle.summary,
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

  // Related articles same category
  const related = articles
    .filter((a) => a.id !== localArticle.id && a.category === localArticle.category)
    .slice(0, 4);

  const currentIdx = articles.findIndex((a) => a.id === localArticle.id);
  const nextArticle = articles[currentIdx + 1] || articles[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={localArticle.title}
        description={(localArticle.centerPerspective || localArticle.summary || "").slice(0, 160)}
        canonicalPath={`/crypto/${localArticle.id}`}
        type="article"
      />

      <Header />

      <main className="container mx-auto px-4 py-8 pt-32">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/crypto" className="hover:text-foreground">Crypto</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{localArticle.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/crypto" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Crypto Hub
              </Link>

              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {categoryLabels[localArticle.category] || localArticle.category}
                  </Badge>
                  {localArticle.relatedSymbols.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />{timeAgo}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
                  {localArticle.title}
                </h1>
                <p className="text-muted-foreground">
                  Originally published by <span className="font-medium text-foreground">{localArticle.source}</span>
                </p>
              </header>

              {/* Image */}
              <div className="relative rounded-xl overflow-hidden mb-8">
                <img
                  src={localArticle.imageUrl}
                  alt={localArticle.title}
                  className="w-full h-64 md:h-96 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
                  }}
                />
              </div>

              {/* Bias Analysis */}
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Political Bias Analysis</h2>
                  {!hasAnalysis && (
                    <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      AI Deep Analysis
                    </Button>
                  )}
                </div>
                {localArticle.biasPercentages && (
                  <BiasPercentageBar percentages={localArticle.biasPercentages} size="lg" />
                )}
              </section>

              {/* Multi-Perspective or Summary */}
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
                  <h2 className="text-lg font-semibold mb-3">Summary</h2>
                  <p className="text-muted-foreground leading-relaxed">{localArticle.summary}</p>
                </section>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button className="btn-glow" asChild>
                  <a href={localArticle.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>

              <NewsletterCTA />

              {/* Related */}
              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl font-semibold mb-6">Related Crypto News</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {related.map((a) => (
                      <Link
                        key={a.id}
                        to={`/crypto/${a.id}`}
                        className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                      >
                        <h3 className="font-medium line-clamp-2 mb-2">{a.title}</h3>
                        <p className="text-xs text-muted-foreground">{a.source}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </article>

          {/* Sidebar - Trending crypto news */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-lg font-semibold">Trending Crypto</h3>
              {articles.slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  to={`/crypto/${a.id}`}
                  className={`block p-3 rounded-lg border transition-colors ${
                    a.id === localArticle.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="text-sm font-medium line-clamp-2">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.source}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Share Modal */}
      <CryptoShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        article={{
          id: localArticle.id,
          title: localArticle.title,
          url: localArticle.url,
          centerPerspective: localArticle.centerPerspective,
          leftPerspective: localArticle.leftPerspective,
          rightPerspective: localArticle.rightPerspective,
          summary: localArticle.summary,
        }}
      />

      {/* Read Next */}
      <AnimatePresence>
        {showReadNext && nextArticle && (
          <ReadNextPrompt
            article={{
              id: nextArticle.id,
              title: nextArticle.title,
              source: nextArticle.source,
              imageUrl: nextArticle.imageUrl,
              url: `/crypto/${nextArticle.id}`,
              publishedAt: nextArticle.publishedAt,
              category: "crypto",
              aiSummary: nextArticle.summary,
              politicalBias: "center",
              biasPercentages: { left: 33, center: 34, right: 33 },
              balancedSummary: nextArticle.summary,
            }}
          />
        )}
      </AnimatePresence>

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
}
