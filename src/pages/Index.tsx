import { useState } from "react";
import { Header } from "@/components/Header";
import { PriceTicker } from "@/components/PriceTicker";
import { HeroSection } from "@/components/HeroSection";
import { NewsFeed } from "@/components/NewsFeed";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { SEOHead } from "@/components/SEOHead";
import { CookieBanner } from "@/components/CookieBanner";
import type { Interest } from "@/components/InterestSelector";

const Index = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI-Powered Finance News with Bias Detection"
        description="Get real-time stock market, cryptocurrency, and commodities news with AI-powered summaries and political bias detection. Track S&P 500, NASDAQ, Bitcoin, Ethereum, Gold prices and more."
        keywords="stock market news, cryptocurrency news, AI news analysis, political bias detection, financial news"
        canonicalPath="/"
      />
      
      <Header />
      <PriceTicker />
      
      <main>
        <HeroSection onGetStarted={() => setShowAuthModal(true)} />
        
        <NewsFeed 
          selectedInterests={selectedInterests}
          onInterestChange={setSelectedInterests}
        />

        {/* Newsletter Section */}
        <section id="newsletter" aria-labelledby="newsletter-heading" className="py-20 relative">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 id="newsletter-heading" className="sr-only">Subscribe to Newsletter</h2>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode="signup"
      />
      
      <CookieBanner />
    </div>
  );
};

export default Index;
