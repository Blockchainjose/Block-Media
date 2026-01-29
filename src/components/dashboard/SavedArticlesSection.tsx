import { motion } from "framer-motion";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiasIndicator } from "@/components/ui/BiasIndicator";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedArticlesSection() {
  const { savedArticles, isLoading, unsaveArticle } = useSavedArticles();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Saved Articles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!savedArticles || savedArticles.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Saved Articles</h2>
        <Card className="p-12 text-center">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved articles yet</h3>
          <p className="text-muted-foreground">
            Save articles from the news feed to read them later
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">
        Saved Articles ({savedArticles.length})
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col">
              {article.article_image_url && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.article_image_url}
                    alt={article.article_title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {article.article_source && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                      {article.article_source}
                    </span>
                  )}
                </div>
              )}
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {article.article_title}
                </h3>
                
                {article.political_bias && (
                  <div className="mb-2">
                    <BiasIndicator bias={article.political_bias} size="sm" />
                  </div>
                )}
                
                {article.ai_summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {article.ai_summary}
                  </p>
                )}
                
                <div className="mt-auto flex items-center gap-2">
                  <Button variant="default" size="sm" className="flex-1" asChild>
                    <a href={article.article_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Read
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => unsaveArticle.mutate(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
