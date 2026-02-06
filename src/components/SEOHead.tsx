import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  type?: "website" | "article";
  image?: string;
  publishedAt?: string;
  author?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = "",
  type = "website",
  image = "/og-image.png",
  publishedAt,
  author = "Block Media",
}: SEOHeadProps) {
  const baseUrl = "https://blockmediacorp.com";
  const fullTitle = `${title} | Block Media`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Primary meta tags
    updateMeta("description", description);
    if (keywords) {
      updateMeta("keywords", keywords);
    }
    updateMeta("author", author);

    // Open Graph - Site name is always Block Media
    updateMeta("og:site_name", "Block Media", true);
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", canonicalUrl, true);
    updateMeta("og:type", type === "article" ? "article" : "website", true);
    updateMeta("og:image", imageUrl, true);
    updateMeta("og:image:width", "1200", true);
    updateMeta("og:image:height", "630", true);
    updateMeta("og:locale", "en_US", true);

    // Article-specific Open Graph
    if (type === "article" && publishedAt) {
      updateMeta("article:published_time", publishedAt, true);
      updateMeta("article:author", author, true);
      updateMeta("article:publisher", "Block Media", true);
    }

    // Twitter Card - Always shows Block Media as source
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:site", "@BlockMedia");
    updateMeta("twitter:creator", "@BlockMedia");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", imageUrl);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", canonicalUrl);
      document.head.appendChild(canonical);
    }
  }, [fullTitle, description, keywords, canonicalUrl, type, imageUrl, publishedAt, author]);

  return null;
}
