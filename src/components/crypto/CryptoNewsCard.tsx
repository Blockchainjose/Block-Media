import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Clock } from "lucide-react";
import type { CryptoNewsArticle } from "@/hooks/useCryptoNews";
import { formatDistanceToNow } from "date-fns";

interface CryptoNewsCardProps {
  article: CryptoNewsArticle;
}

const categoryColors: Record<CryptoNewsArticle["category"], string> = {
  price: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  regulation: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  protocol: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  blockchain: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  general: "bg-muted text-muted-foreground border-muted",
};

const categoryLabels: Record<CryptoNewsArticle["category"], string> = {
  price: "Price & Trading",
  regulation: "Regulation",
  protocol: "Protocol",
  blockchain: "Blockchain",
  general: "General",
};

export function CryptoNewsCard({ article }: CryptoNewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
            }}
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={categoryColors[article.category]}>
              {categoryLabels[article.category]}
            </Badge>
            {article.relatedSymbols.slice(0, 3).map((symbol) => (
              <Badge key={symbol} variant="secondary" className="text-xs">
                {symbol}
              </Badge>
            ))}
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">{article.title}</h3>
          </a>

          {article.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">{article.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Read <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
