import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PriceTicker } from "@/components/PriceTicker";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us - Breaking the Echo Chamber"
        description="Block Media is on a mission to restore balanced financial journalism. We use AI to deliver multi-perspective news summaries, helping readers escape echo chambers and find common ground."
        keywords="balanced news, unbiased financial news, AI journalism, media bias solution, common ground news"
        canonicalPath="/about"
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
              News That <span className="text-gradient-red font-normal">Unites</span>, Not Divides
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe informed citizens make better decisions. That's why we're building 
              a different kind of news platform—one that shows you the whole picture.
            </p>
          </motion.div>
        </section>

        {/* The Problem Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card/50 border border-border"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-destructive" />
                </span>
                The Problem We're Solving
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Social media algorithms and legacy media outlets have created something dangerous: 
                  <strong className="text-foreground"> echo chambers</strong> that reinforce what you already believe 
                  while hiding perspectives that challenge your thinking.
                </p>
                <p>
                  In finance, this is particularly harmful. Markets don't care about political affiliation—they 
                  respond to facts, data, and global events. Yet most financial news is filtered through 
                  partisan lenses, leaving readers with incomplete pictures of what's really happening.
                </p>
                <p>
                  The result? Investors make decisions based on half-truths. Citizens form opinions without 
                  understanding opposing viewpoints. Trust in media continues to erode.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </span>
                Our Solution: AI-Powered Balance
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Block Media takes a radically different approach. We aggregate financial news from across 
                  the political spectrum—from CNN and MSNBC to Fox News and Fox Business, with CNBC and 
                  MarketWatch providing center perspectives.
                </p>
                <p>
                  But we don't stop at aggregation. Our <strong className="text-foreground">AI analyzes every story</strong> to 
                  identify political lean, then generates three distinct summaries:
                </p>
                <ul className="list-none space-y-3 my-6">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <span><strong className="text-foreground">Left-Leaning Perspective:</strong> How progressive outlets frame the story</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                    <span><strong className="text-foreground">Right-Leaning Perspective:</strong> How conservative outlets frame the story</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                    <span><strong className="text-foreground">Common Ground:</strong> The facts both sides agree on, stripped of partisan framing</span>
                  </li>
                </ul>
                <p>
                  This "Common Ground" summary is our flagship feature. It cuts through the noise to show you 
                  what's actually happening—the shared facts that form the basis for informed decision-making.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl bg-card/50 border border-border"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-amber-500" />
                </span>
                Why This Matters
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We're not here to tell you what to think. We're here to give you the 
                  <strong className="text-foreground"> complete picture</strong> so you can think for yourself.
                </p>
                <p>
                  Whether you're a day trader monitoring breaking news, a long-term investor researching 
                  market trends, or simply a curious citizen wanting to understand the economy—you deserve 
                  access to balanced, comprehensive information.
                </p>
                <p>
                  By showing you how different outlets cover the same story, we help you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Recognize bias when you encounter it elsewhere</li>
                  <li>Understand why people with different views see the world differently</li>
                  <li>Make financial decisions based on facts, not partisan spin</li>
                  <li>Engage in more productive conversations about markets and economics</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-2xl bg-card/50 border border-border"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-500" />
                </span>
                Our Commitment to You
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    We always show you which sources we're pulling from and how we've classified their political lean.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">No Hidden Agenda</h3>
                  <p className="text-sm text-muted-foreground">
                    Our goal is balance, not persuasion. We present all sides and let you draw your own conclusions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Continuous Improvement</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI models are constantly learning and improving to provide more accurate bias detection and better summaries.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">User-First Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Every feature we build is designed to help you consume news more efficiently and effectively.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Join the Movement</h2>
            <p className="text-muted-foreground mb-6">
              Break free from echo chambers. Start reading news that respects your intelligence.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Reading Free
            </a>
            <p className="text-sm text-muted-foreground mt-6">
              Questions? Reach us at{" "}
              <a href="mailto:contact@blockmediacorp.com" className="text-primary hover:underline">
                contact@blockmediacorp.com
              </a>
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
