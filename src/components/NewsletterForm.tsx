import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InterestSelector, type Interest } from "./InterestSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const toggleInterest = (interest: Interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || interests.length === 0) {
      toast({
        title: "Please complete the form",
        description: "Enter your email and select at least one interest.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email,
          interests,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive your first newsletter soon.",
      });
    } catch (error: any) {
      // Generic error to avoid revealing whether an email is already subscribed
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass-card p-8 md:p-12 rounded-2xl"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold mb-2">You're In!</h3>
              <p className="text-muted-foreground">
                Check your inbox for a confirmation email. Your personalized finance insights are on the way!
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold">Weekly Finance Digest</h3>
                  <p className="text-muted-foreground">AI-powered insights delivered every Monday</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Your Interests</label>
                  <InterestSelector
                    selectedInterests={interests}
                    onToggle={toggleInterest}
                    variant="compact"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-background border-border"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-glow h-12 px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Free"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Terms of Service.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
