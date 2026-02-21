
-- Add bio column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reputation integer NOT NULL DEFAULT 0;

-- Create sentiment enum
CREATE TYPE public.post_sentiment AS ENUM ('bullish', 'bearish');

-- Create article_comments table (threaded)
CREATE TABLE public.article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id text NOT NULL,
  user_id uuid NOT NULL,
  parent_id uuid REFERENCES public.article_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_length CHECK (length(content) <= 2000)
);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON public.article_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can create comments" ON public.article_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.article_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.article_comments FOR DELETE USING (auth.uid() = user_id);

-- Create comment_votes table
CREATE TABLE public.comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.article_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  vote_type smallint NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);

ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "Auth users can vote" ON public.comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change own vote" ON public.comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove own vote" ON public.comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Create community_posts table
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  sentiment public.post_sentiment,
  asset_tags text[] NOT NULL DEFAULT '{}',
  likes_count integer NOT NULL DEFAULT 0,
  replies_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_content_length CHECK (length(content) <= 500)
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Auth users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can like" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Create post_replies table
CREATE TABLE public.post_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reply_content_length CHECK (length(content) <= 500)
);

ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read replies" ON public.post_replies FOR SELECT USING (true);
CREATE POLICY "Auth users can reply" ON public.post_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.post_replies FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_article_comments_updated_at
  BEFORE UPDATE ON public.article_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_article_comments_article_id ON public.article_comments(article_id);
CREATE INDEX idx_article_comments_parent_id ON public.article_comments(parent_id);
CREATE INDEX idx_comment_votes_comment_id ON public.comment_votes(comment_id);
CREATE INDEX idx_community_posts_sentiment ON public.community_posts(sentiment);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_posts_asset_tags ON public.community_posts USING GIN(asset_tags);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_replies_post_id ON public.post_replies(post_id);

-- Enable realtime for comments and posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_replies;

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION public.update_comment_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 1 THEN
      UPDATE article_comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE article_comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
    -- Update author reputation
    UPDATE profiles SET reputation = reputation + NEW.vote_type
      WHERE user_id = (SELECT user_id FROM article_comments WHERE id = NEW.comment_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 1 THEN
      UPDATE article_comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE article_comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
    UPDATE profiles SET reputation = reputation - OLD.vote_type
      WHERE user_id = (SELECT user_id FROM article_comments WHERE id = OLD.comment_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_comment_vote_change
  AFTER INSERT OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_votes();

-- Function to update post like and reply counts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    UPDATE profiles SET reputation = reputation + 1
      WHERE user_id = (SELECT user_id FROM community_posts WHERE id = NEW.post_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    UPDATE profiles SET reputation = reputation - 1
      WHERE user_id = (SELECT user_id FROM community_posts WHERE id = OLD.post_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

CREATE OR REPLACE FUNCTION public.update_post_replies_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET replies_count = replies_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET replies_count = replies_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_post_reply_change
  AFTER INSERT OR DELETE ON public.post_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_post_replies_count();

-- Update profiles SELECT policy to allow public viewing for community
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
