import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PriceTicker } from "@/components/PriceTicker";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax transforms for different sections
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3]);
  const problemY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
  const solutionY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const whyY = useTransform(scrollYProgress, [0.35, 0.55], [100, 0]);
  const commitmentY = useTransform(scrollYProgress, [0.5, 0.7], [100, 0]);
  const ctaY = useTransform(scrollYProgress, [0.65, 0.85], [100, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <SEOHead
        title="About Us - Breaking the Echo Chamber"
        description="Block Media is on a mission to restore balanced financial journalism. We use AI to deliver multi-perspective news summaries, helping readers escape echo chambers and find common ground."
        keywords="balanced news, unbiased financial news, AI journalism, media bias solution, common ground news"
        canonicalPath="/about"
      />
      
      <Header />
      <PriceTicker />
      
      <main className="pt-32 pb-20 overflow-hidden">
        {/* Hero Section with Parallax */}
        <section className="container mx-auto px-4 mb-20 relative">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
            >
              News That <span className="text-gradient-red font-normal">Unites</span>, Not Divides
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              We believe informed citizens make better decisions. That's why we're building 
              a different kind of news platform—one that shows you the whole picture.
            </motion.p>
          </motion.div>
          
          {/* Decorative floating elements */}
          <motion.div 
            className="absolute -left-20 top-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl"
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -right-20 bottom-0 w-60 h-60 rounded-full bg-destructive/5 blur-3xl"
            animate={{ 
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </section>

        {/* The Problem Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              style={{ y: problemY }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3"
              >
                <motion.span 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-destructive/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
                </motion.span>
                The Problem We're Solving
              </motion.h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Social media algorithms and legacy media outlets have created something dangerous: 
                  <strong className="text-foreground"> echo chambers</strong> that reinforce what you already believe 
                  while hiding perspectives that challenge your thinking.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  In finance, this is particularly harmful. Markets don't care about political affiliation—they 
                  respond to facts, data, and global events. Yet most financial news is filtered through 
                  partisan lenses, leaving readers with incomplete pictures of what's really happening.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  The result? Investors make decisions based on half-truths. Citizens form opinions without 
                  understanding opposing viewpoints. Trust in media continues to erode.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              style={{ y: solutionY }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3 relative z-10"
              >
                <motion.span 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </motion.span>
                Our Solution: AI-Powered Balance
              </motion.h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed relative z-10">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Block Media takes a radically different approach. We aggregate financial news from across 
                  the political spectrum—from CNN, MSNBC, and NYT to Fox News and Fox Business, with CNBC, WSJ, 
                  and MarketWatch providing center perspectives.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  But we don't stop at aggregation. Our <strong className="text-foreground">AI analyzes every story</strong> to 
                  identify political lean, then generates three distinct summaries:
                </motion.p>
                <ul className="list-none space-y-4 my-6">
                  {[
                    { color: "bg-blue-500", label: "Left-Leaning Perspective:", desc: "How progressive outlets frame the story", delay: 0.3 },
                    { color: "bg-red-500", label: "Right-Leaning Perspective:", desc: "How conservative outlets frame the story", delay: 0.4 },
                    { color: "bg-emerald-500", label: "Common Ground:", desc: "The facts both sides agree on, stripped of partisan framing", delay: 0.5 },
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: item.delay }}
                      className="flex items-start gap-3"
                    >
                      <motion.span 
                        className={`w-3 h-3 mt-1.5 rounded-full ${item.color}`}
                        whileHover={{ scale: 1.5 }}
                      />
                      <span><strong className="text-foreground">{item.label}</strong> {item.desc}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  This "Common Ground" summary is our flagship feature. It cuts through the noise to show you 
                  what's actually happening—the shared facts that form the basis for informed decision-making.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              style={{ y: whyY }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3"
              >
                <motion.span 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                </motion.span>
                Why This Matters
              </motion.h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  We're not here to tell you what to think. We're here to give you the 
                  <strong className="text-foreground"> complete picture</strong> so you can think for yourself.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Whether you're a day trader monitoring breaking news, a long-term investor researching 
                  market trends, or simply a curious citizen wanting to understand the economy—you deserve 
                  access to balanced, comprehensive information.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  By showing you how different outlets cover the same story, we help you:
                </motion.p>
                <ul className="space-y-3 ml-4">
                  {[
                    "Recognize bias when you encounter it elsewhere",
                    "Understand why people with different views see the world differently",
                    "Make financial decisions based on facts, not partisan spin",
                    "Engage in more productive conversations about markets and economics",
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <motion.span 
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        whileHover={{ scale: 2 }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              style={{ y: commitmentY }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3"
              >
                <motion.span 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                </motion.span>
                Our Commitment to You
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Transparency", desc: "We always show you which sources we're pulling from and how we've classified their political lean.", delay: 0.1 },
                  { title: "No Hidden Agenda", desc: "Our goal is balance, not persuasion. We present all sides and let you draw your own conclusions.", delay: 0.2 },
                  { title: "Continuous Improvement", desc: "Our AI models are constantly learning and improving to provide more accurate bias detection and better summaries.", delay: 0.3 },
                  { title: "User-First Design", desc: "Every feature we build is designed to help you consume news more efficiently and effectively.", delay: 0.4 },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="space-y-2 p-4 rounded-xl bg-background/50 border border-border/50 transition-colors hover:border-primary/30"
                  >
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <motion.div
            style={{ y: ctaY }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-semibold mb-4"
            >
              Join the Movement
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mb-6"
            >
              Break free from echo chambers. Start reading news that respects your intelligence.
            </motion.p>
            <motion.a 
              href="/" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Start Reading Free
            </motion.a>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-muted-foreground mt-6"
            >
              Questions? Reach us at{" "}
              <a href="mailto:contact@blockmediacorp.com" className="text-primary hover:underline">
                contact@blockmediacorp.com
              </a>
            </motion.p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
