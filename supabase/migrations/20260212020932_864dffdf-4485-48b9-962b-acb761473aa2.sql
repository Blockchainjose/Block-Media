-- Deny anonymous users from reading newsletter subscriptions
CREATE POLICY "Deny anonymous select on newsletter_subscriptions"
ON public.newsletter_subscriptions
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);