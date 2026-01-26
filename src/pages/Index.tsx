import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NewsFeed } from "@/components/NewsFeed";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import type { Interest } from "@/components/InterestSelector";

const Index = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onGetStarted={() => setShowAuthModal(true)} />
        
        <NewsFeed 
          selectedInterests={selectedInterests}
          onInterestChange={setSelectedInterests}
        />

        {/* Newsletter Section */}
        <section id="newsletter" className="py-20 relative">
          <div className="container mx-auto px-4 max-w-3xl">
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
    </div>
  );
};

export default Index;
