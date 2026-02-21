
-- Market category enum
CREATE TYPE public.market_category AS ENUM ('crypto', 'stocks', 'options', 'commodities', 'forex', 'macro', 'general');

-- Add market_category to community_posts
ALTER TABLE public.community_posts ADD COLUMN market_category public.market_category NOT NULL DEFAULT 'general';

-- Badge system
CREATE TYPE public.badge_type AS ENUM (
  'crypto_analyst', 'options_trader', 'top_contributor', 
  'stock_guru', 'commodity_expert', 'macro_strategist',
  'first_post', 'popular_post', 'veteran'
);

CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge badge_type NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System manages badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports table
CREATE TABLE public.content_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  content_type TEXT NOT NULL, -- 'post', 'comment', 'reply'
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, dismissed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.content_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON public.content_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Enable realtime for badges
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;
