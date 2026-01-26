-- Create enum for user interests
CREATE TYPE public.interest_category AS ENUM ('crypto', 'global_markets', 'commodities');

-- Create enum for political bias
CREATE TYPE public.political_bias AS ENUM ('left', 'center', 'right');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user interests table
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interest interest_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, interest)
);

-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  interests interest_category[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Create saved articles table
CREATE TABLE public.saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_url TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_source TEXT,
  article_image_url TEXT,
  ai_summary TEXT,
  political_bias political_bias,
  balanced_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_url)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User interests policies
CREATE POLICY "Users can view their own interests"
  ON public.user_interests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interests"
  ON public.user_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests"
  ON public.user_interests FOR DELETE
  USING (auth.uid() = user_id);

-- Newsletter subscriptions policies
CREATE POLICY "Users can view their own newsletter subscription"
  ON public.newsletter_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert newsletter subscription"
  ON public.newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own newsletter subscription"
  ON public.newsletter_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Saved articles policies
CREATE POLICY "Users can view their own saved articles"
  ON public.saved_articles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved articles"
  ON public.saved_articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved articles"
  ON public.saved_articles FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();