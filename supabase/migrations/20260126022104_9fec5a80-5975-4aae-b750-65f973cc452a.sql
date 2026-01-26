-- Drop the permissive insert policy
DROP POLICY IF EXISTS "Anyone can insert newsletter subscription" ON public.newsletter_subscriptions;

-- Create a more secure policy - allow insert if email matches or user is authenticated
CREATE POLICY "Authenticated users or valid email can subscribe"
  ON public.newsletter_subscriptions FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND user_id IS NULL AND email IS NOT NULL)
  );