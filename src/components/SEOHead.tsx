import { Helmet } from "react-helmet-async";

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

  return (
    <Helmet>
      <title>{fullTitle}</title>

      {/* Primary meta */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Block Media" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG */}
      {type === "article" && publishedAt && (
        <>
          <meta property="article:published_time" content={publishedAt} />
          <meta property="article:author" content={author} />
          <meta property="article:publisher" content="Block Media" />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@BlockMedia" />
      <meta name="twitter:creator" content="@BlockMedia" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
