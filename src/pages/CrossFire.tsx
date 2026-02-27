import { motion } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { CrossFireCard } from "@/components/crossfire/CrossFireCard";
import { useCrossfireStories } from "@/hooks/useCrossfireStories";

export default function CrossFire() {
  const { data: stories = [], isLoading, error } = useCrossfireStories();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="CrossFire — Multi-Source News Comparison"
        description="Compare how different news outlets cover the same story. See left, center, and right perspectives side by side."
        canonicalPath="/crossfire"
      />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Flame className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary uppercase tracking-wider text-sm">
                CrossFire
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Same Story.{" "}
              <span className="text-gradient-red">Different Angles.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              When multiple outlets across the political spectrum cover the same event, CrossFire
              shows you how each side frames it — so you get the full picture.
            </p>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing coverage across outlets…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Failed to load CrossFire stories. Please try again later.
              </p>
            </div>
          )}

          {/* Stories */}
          {!isLoading && !error && stories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <CrossFireCard key={story.id} story={story} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && stories.length === 0 && (
            <div className="text-center py-20">
              <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-xl text-muted-foreground mb-2">No CrossFire stories right now</p>
              <p className="text-sm text-muted-foreground">
                CrossFire stories appear when multiple outlets from different political leans cover
                the same event.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
