import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CrossFireBadge } from "@/components/crossfire/CrossFireBadge";
import { CrossFireLeanMeter } from "@/components/crossfire/CrossFireLeanMeter";
import { CrossFireBreakdown } from "@/components/crossfire/CrossFireBreakdown";
import { useCrossfireStories, useCrossfireStoryById } from "@/hooks/useCrossfireStories";

export default function CrossFireArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: stories = [], isLoading: feedLoading } = useCrossfireStories();
  const { data: dbStory, isLoading: dbLoading } = useCrossfireStoryById(id);

  const feedStory = stories.find((s) => s.id === id);
  const story = feedStory || dbStory;
  const isLoading = feedLoading && dbLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-20 container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Button onClick={() => navigate("/crossfire")}>Back to CrossFire</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const biasOrder: Array<"left" | "center" | "right"> = ["left", "center", "right"];
  const biasLabels = { left: "Left-Leaning", center: "Center", right: "Right-Leaning" };
  const biasColors = {
    left: "border-[hsl(var(--bias-left))]",
    center: "border-[hsl(var(--bias-center))]",
    right: "border-[hsl(var(--bias-right))]",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`CrossFire: ${story.neutralHeadline}`}
        description={story.factualSummary}
        canonicalPath={`/crossfire/${story.id}`}
        image={story.sources[0]?.imageUrl}
      />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <CrossFireBadge size="md" />
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-4">
              {story.neutralHeadline}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              {story.factualSummary}
            </p>
            <div className="max-w-md mx-auto">
              <CrossFireLeanMeter leanSpread={story.leanSpread} />
            </div>
          </motion.div>

          {/* Source cards by lean */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {biasOrder.map((bias) => {
              const sources = story.sources.filter((s) => s.politicalBias === bias);
              if (sources.length === 0) return null;

              return (
                <motion.div
                  key={bias}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: biasOrder.indexOf(bias) * 0.1 }}
                  className="space-y-4"
                >
                  <h2
                    className={`text-sm font-bold uppercase tracking-wider text-center py-2 rounded-lg border-2 ${biasColors[bias]} bg-card`}
                  >
                    {biasLabels[bias]}
                  </h2>
                  {sources.map((source) => (
                    <div
                      key={source.articleId}
                      className={`rounded-xl border-l-4 ${biasColors[bias]} bg-card p-5 space-y-3`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            bias === "left"
                              ? "bg-[hsl(var(--bias-left))]"
                              : bias === "right"
                              ? "bg-[hsl(var(--bias-right))]"
                              : "bg-[hsl(var(--bias-center))]"
                          }`}
                        >
                          {source.source.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold">{source.source}</span>
                      </div>
                      <h3 className="font-semibold leading-snug">{source.headline}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {source.excerpt}
                      </p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Read Full Article
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>

          {/* The Breakdown */}
          <CrossFireBreakdown breakdown={story.breakdown} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
