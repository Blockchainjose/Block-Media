
-- Ad slots configuration
CREATE TABLE public.ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text UNIQUE NOT NULL,
  name text NOT NULL,
  slot_type text NOT NULL DEFAULT 'adsense',
  ad_code text,
  is_active boolean NOT NULL DEFAULT true,
  display_rules jsonb NOT NULL DEFAULT '{}',
  fallback_type text DEFAULT 'newsletter',
  fallback_image_url text,
  fallback_link text,
  size_desktop text,
  size_mobile text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sponsor banners
CREATE TABLE public.sponsor_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL,
  title text NOT NULL,
  image_url text,
  link_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_start timestamptz,
  display_end timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  label text DEFAULT 'Sponsored',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ad events for impression/click tracking
CREATE TABLE public.ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL,
  event_type text NOT NULL DEFAULT 'impression',
  page_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

-- Public read for ad config
CREATE POLICY "Anyone can read ad slots" ON public.ad_slots FOR SELECT USING (true);
CREATE POLICY "Anyone can read sponsor banners" ON public.sponsor_banners FOR SELECT USING (true);

-- Anyone can log ad events (impressions/clicks)
CREATE POLICY "Anyone can log ad events" ON public.ad_events FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_ad_events_slot_created ON public.ad_events(slot_key, created_at);
CREATE INDEX idx_sponsor_active ON public.sponsor_banners(slot_key, is_active);
CREATE INDEX idx_ad_slots_active ON public.ad_slots(slot_key, is_active);

-- Seed default ad slots
INSERT INTO public.ad_slots (slot_key, name, slot_type, is_active, size_desktop, size_mobile, display_rules, fallback_type) VALUES
('leaderboard', 'Leaderboard Banner', 'adsense', true, '728x90', '320x50', '{"pages":"all"}', 'newsletter'),
('sidebar', 'Sidebar Ad', 'adsense', true, '300x250', null, '{"pages":"all","device":"desktop"}', 'newsletter'),
('in-feed', 'In-Feed Native Ad', 'adsense', true, 'responsive', 'responsive', '{"pages":"home","interval":8}', 'newsletter'),
('in-article', 'In-Article Ad', 'adsense', true, 'responsive', 'responsive', '{"pages":"article","position":3}', 'youtube'),
('sticky-footer', 'Sticky Footer Banner', 'adsense', true, '728x90', '320x50', '{"pages":"all"}', 'newsletter'),
('interstitial', 'Interstitial Overlay', 'adsense', false, 'responsive', 'responsive', '{"pages":"all"}', 'newsletter'),
('sponsor-header', 'Sponsor Header Banner', 'sponsor', true, '728x90', '320x50', '{"pages":"all"}', 'newsletter'),
('sponsor-article-footer', 'Sponsor Article Footer', 'sponsor', true, '728x90', 'responsive', '{"pages":"article"}', 'newsletter'),
('sponsor-sidebar-widget', 'Sponsor Sidebar Widget', 'sponsor', true, '300x250', null, '{"pages":"all","device":"desktop"}', 'newsletter');
