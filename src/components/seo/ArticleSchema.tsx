import { useEffect } from "react";
import type { NewsArticle } from "@/types/article";

interface ArticleSchemaProps {
  article: NewsArticle;
  url: string;
}

export function ArticleSchema({ article, url }: ArticleSchemaProps) {
  const baseUrl = "https://blockmediacorp.com";

  useEffect(() => {
    // Create NewsArticle schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.aiSummary,
      image: article.imageUrl,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        "@type": "Organization",
        name: article.source,
      },
      publisher: {
        "@type": "Organization",
        name: "Block Media",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/og-image.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}${url}`,
      },
      articleSection: getCategoryLabel(article.category),
      keywords: getKeywords(article.category),
    };

    // Add or update schema script
    let schemaScript = document.querySelector('script[data-schema="article"]');
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("type", "application/ld+json");
      schemaScript.setAttribute("data-schema", "article");
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    // Cleanup on unmount
    return () => {
      const existingScript = document.querySelector('script[data-schema="article"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [article, url]);

  return null;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    crypto: "Cryptocurrency",
    global_markets: "Global Markets",
    commodities: "Commodities",
  };
  return labels[category] || category;
}

function getKeywords(category: string): string {
  const keywords: Record<string, string> = {
    crypto: "cryptocurrency, bitcoin, ethereum, blockchain, DeFi",
    global_markets: "stocks, indices, S&P 500, NASDAQ, market analysis",
    commodities: "gold, oil, commodities, precious metals, energy",
  };
  return keywords[category] || "finance, news, markets";
}
