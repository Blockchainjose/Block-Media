import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PriceTicker } from "@/components/PriceTicker";
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Sparkles,
  Eye,
  Layers,
  RefreshCw
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Summaries",
    description: "Get instant, intelligent summaries of complex financial news. Our AI distills lengthy articles into key insights, saving you time while keeping you informed.",
    color: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "Political Bias Detection",
    description: "Every article is analyzed for political lean. See at a glance whether coverage skews left, right, or center—so you can consume news with full awareness.",
    color: "text-blue-500",
  },
  {
    icon: Layers,
    title: "Multi-Perspective Analysis",
    description: "For every story, get three viewpoints: left-leaning, right-leaning, and common ground. Understand all sides before forming your own opinion.",
    color: "text-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Personalized Feed",
    description: "Choose your interests—Crypto, Global Markets, or Commodities—and receive a curated news feed tailored specifically to what matters most to you.",
    color: "text-green-500",
  },
  {
    icon: Globe,
    title: "Trusted US Sources",
    description: "We aggregate from major US financial outlets including CNBC, Fox Business, CNN, MSNBC, MarketWatch, and more—giving you comprehensive coverage.",
    color: "text-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Market Data",
    description: "Live price tickers for stocks, crypto, and commodities. Stay updated on S&P 500, NASDAQ, Bitcoin, Ethereum, Gold, and more—all in one place.",
    color: "text-orange-500",
  },
  {
    icon: Eye,
    title: "Bias-Aware Reading",
    description: "Visual indicators show the political distribution of each story's coverage. Make informed decisions about the news you consume.",
    color: "text-pink-500",
  },
  {
    icon: Sparkles,
    title: "Common Ground Focus",
    description: "Our AI identifies shared facts and consensus points across partisan divides, helping you find truth beyond the echo chambers.",
    color: "text-indigo-500",
  },
  {
    icon: RefreshCw,
    title: "Continuous Updates",
    description: "News is refreshed throughout the day. Never miss breaking financial stories that could impact your portfolio or understanding of markets.",
    color: "text-teal-500",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Features - AI News Aggregation & Bias Detection"
        description="Discover Block Media's powerful features: AI-powered summaries, political bias detection, multi-perspective analysis, and personalized finance news feeds from trusted US sources."
        keywords="AI news summary, political bias detection, multi-perspective news, finance news aggregator, personalized news feed"
        canonicalPath="/features"
      />
      
      <Header />
      <PriceTicker />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Features That <span className="text-gradient-red font-normal">Empower</span> Your News
            </h1>
            <p className="text-lg text-muted-foreground">
              Block Media combines cutting-edge AI with balanced journalism principles 
              to deliver finance news you can trust and understand.
            </p>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
          >
            <h2 className="text-2xl font-semibold mb-4">Ready to Read Smarter?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands who've broken free from biased news bubbles.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Reading Free
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
