-- Add DELETE policy so authenticated users can remove their own newsletter subscriptions
CREATE POLICY "Users can delete their own newsletter subscription"
  ON public.newsletter_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);