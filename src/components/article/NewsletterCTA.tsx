import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
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
          interests: ["crypto", "global_markets", "commodities"],
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Subscribed!",
        description: "You'll receive our weekly digest soon.",
      });
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message.includes("duplicate")
          ? "This email is already subscribed."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
          <Check className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">You're subscribed!</h3>
        <p className="text-sm text-muted-foreground">
          Check your inbox for a confirmation email.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-border">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Stay Informed</h3>
          <p className="text-sm text-muted-foreground">
            Get AI-powered finance insights delivered to your inbox every week.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} className="btn-glow">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
}
