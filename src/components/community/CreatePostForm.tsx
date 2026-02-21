import { useState } from "react";
import { TrendingUp, TrendingDown, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CreatePostFormProps {
  onSubmit: (content: string, sentiment: "bullish" | "bearish" | null, assetTags: string[]) => Promise<boolean>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Extract $TAGS from content
  const extractTags = (text: string): string[] => {
    const matches = text.match(/\$[A-Z]{1,10}/g);
    return matches ? [...new Set(matches.map(t => t.toUpperCase()))] : [];
  };

  const tags = extractTags(content);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const success = await onSubmit(content, sentiment, tags);
    if (success) {
      setContent("");
      setSentiment(null);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-5 rounded-xl bg-card border border-border space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's your take on the market? Use $BTC, $ETH to tag assets..."
        className="min-h-[100px] bg-muted/30 resize-none"
        maxLength={500}
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Sentiment toggle */}
          <Button
            variant={sentiment === "bullish" ? "default" : "outline"}
            size="sm"
            onClick={() => setSentiment(sentiment === "bullish" ? null : "bullish")}
            className={sentiment === "bullish" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Bullish
          </Button>
          <Button
            variant={sentiment === "bearish" ? "default" : "outline"}
            size="sm"
            onClick={() => setSentiment(sentiment === "bearish" ? null : "bearish")}
            className={sentiment === "bearish" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            <TrendingDown className="h-3 w-3 mr-1" />
            Bearish
          </Button>

          {/* Show detected tags */}
          {tags.length > 0 && (
            <div className="flex gap-1 ml-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
          <Button onClick={handleSubmit} disabled={submitting || !content.trim()} size="sm">
            {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
