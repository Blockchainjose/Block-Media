import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * When users/crawlers hit /sitemap.xml in the SPA,
 * redirect them to the dynamic edge function sitemap.
 */
export default function SitemapRedirect() {
  useEffect(() => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap`;
    window.location.replace(url);
  }, []);

  return null;
}
