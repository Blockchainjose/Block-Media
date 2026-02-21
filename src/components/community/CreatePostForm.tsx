import { useState } from "react";
import { TrendingUp, TrendingDown, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTagColorClass, getCategoryLabel, type MarketCategory, filterProfanity } from "@/lib/market-utils";

interface CreatePostFormProps {
  onSubmit: (content: string, sentiment: "bullish" | "bearish" | null, assetTags: string[], marketCategory: MarketCategory) => Promise<boolean>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | null>(null);
  const [category, setCategory] = useState<MarketCategory>("general");
  const [submitting, setSubmitting] = useState(false);

  const extractTags = (text: string): string[] => {
    const matches = text.match(/\$[A-Z]{1,10}/g);
    return matches ? [...new Set(matches.map(t => t.toUpperCase()))] : [];
  };

  const tags = extractTags(content);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const filtered = filterProfanity(content);
    const success = await onSubmit(filtered, sentiment, tags, category);
    if (success) {
      setContent("");
      setSentiment(null);
      setCategory("general");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-5 rounded-xl bg-card border border-border space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's your take on the market? Use $BTC, $AAPL, $GOLD to tag assets..."
        className="min-h-[100px] bg-muted/30 resize-none"
        maxLength={500}
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category selector */}
          <Select value={category} onValueChange={(v) => setCategory(v as MarketCategory)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["general", "crypto", "stocks", "options", "commodities", "forex", "macro"] as MarketCategory[]).map(cat => (
                <SelectItem key={cat} value={cat} className="text-xs">{getCategoryLabel(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          {/* Show detected tags with color coding */}
          {tags.length > 0 && (
            <div className="flex gap-1 ml-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className={`text-xs ${getTagColorClass(tag)}`}>{tag}</Badge>
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
