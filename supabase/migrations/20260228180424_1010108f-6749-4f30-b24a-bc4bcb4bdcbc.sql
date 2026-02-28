
-- Articles table for persistent storage of all fetched articles
CREATE TABLE public.news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  image_url TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  category TEXT NOT NULL DEFAULT 'general',
  article_type TEXT NOT NULL DEFAULT 'news',
  ai_summary TEXT,
  balanced_summary TEXT,
  political_bias TEXT,
  bias_left INTEGER DEFAULT 33,
  bias_center INTEGER DEFAULT 34,
  bias_right INTEGER DEFAULT 33,
  left_perspective TEXT,
  right_perspective TEXT,
  center_perspective TEXT,
  related_symbols TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CrossFire stories table
CREATE TABLE public.crossfire_stories (
  id TEXT PRIMARY KEY,
  neutral_headline TEXT NOT NULL,
  factual_summary TEXT,
  breakdown TEXT,
  lean_left INTEGER DEFAULT 0,
  lean_center INTEGER DEFAULT 0,
  lean_right INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CrossFire story sources (linking stories to their source articles)
CREATE TABLE public.crossfire_story_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id TEXT NOT NULL REFERENCES public.crossfire_stories(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  source TEXT NOT NULL,
  headline TEXT NOT NULL,
  excerpt TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  political_bias TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crossfire_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crossfire_story_sources ENABLE ROW LEVEL SECURITY;

-- Public read access (articles must be accessible to unauthenticated users)
CREATE POLICY "Anyone can read articles" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read crossfire stories" ON public.crossfire_stories FOR SELECT USING (true);
CREATE POLICY "Anyone can read crossfire sources" ON public.crossfire_story_sources FOR SELECT USING (true);

-- Service role handles inserts/updates (edge functions use service role key)
-- No INSERT/UPDATE policies needed for anon role

-- Index for fast lookups
CREATE INDEX idx_news_articles_type ON public.news_articles(article_type);
CREATE INDEX idx_news_articles_published ON public.news_articles(published_at DESC);
CREATE INDEX idx_crossfire_sources_story ON public.crossfire_story_sources(story_id);

-- Updated_at trigger for news_articles
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
