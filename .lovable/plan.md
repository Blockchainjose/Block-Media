

## Fix Google Login

### Problem
The Google login fails with "provider is not enabled" because the code calls `supabase.auth.signInWithOAuth()` directly. Lovable Cloud manages Google OAuth through its own module, which hasn't been set up yet.

### Solution

1. **Generate the Lovable Cloud auth module** using the Configure Social Login tool for Google. This creates the necessary files in `src/integrations/lovable/`.

2. **Update `src/components/AuthModal.tsx`** to replace the direct Supabase call:
   - Import `lovable` from `@/integrations/lovable/index`
   - Change `handleGoogleSignIn` to use `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` instead of `supabase.auth.signInWithOAuth({ provider: "google", ... })`

### Technical Details

- The `supabase.auth.signInWithOAuth` call bypasses Lovable Cloud's managed OAuth configuration, which is why the provider appears "not enabled" at the authentication layer.
- The `lovable.auth.signInWithOAuth` function routes through Lovable Cloud's pre-configured Google OAuth credentials, so no API keys or Google Cloud Console setup is needed.
- No database changes are required; the existing `handle_new_user` trigger will still create profiles for new Google sign-ins.

