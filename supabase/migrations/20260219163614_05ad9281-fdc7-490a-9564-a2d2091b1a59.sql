
-- Add email format validation constraint to newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');

-- Add email length constraint (RFC 5321 max)
ALTER TABLE public.newsletter_subscriptions
ADD CONSTRAINT email_max_length
CHECK (length(email) <= 254);
