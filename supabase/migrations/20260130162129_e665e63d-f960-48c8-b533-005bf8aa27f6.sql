-- Add UPDATE policy for user_interests table
CREATE POLICY "Users can update their own interests"
ON public.user_interests
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);