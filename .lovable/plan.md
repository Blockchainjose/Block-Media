

## Fix Google OAuth for Custom Domain (blockmediacorp.com)

### Problem
The Lovable OAuth server only allows redirect URIs on `*.lovable.app` domains. Since `blockmediacorp.com` is hosted on Vercel and can't be registered as a Lovable custom domain (DNS conflict), Google sign-in fails with "invalid request."

### Solution: OAuth Relay via Lovable Domain

Use the published Lovable URL (`orbit-news-feed.lovable.app`) as an intermediary. After Google authentication completes on the Lovable domain, tokens are forwarded back to `blockmediacorp.com` via URL hash -- which the authentication client picks up automatically.

```text
User on blockmediacorp.com
    |
    v
clicks "Continue with Google"
    |
    v
redirect_uri = orbit-news-feed.lovable.app/auth/callback?return_to=blockmediacorp.com
    |
    v
Google sign-in completes
    |
    v
Lands on orbit-news-feed.lovable.app/auth/callback#access_token=...
    |
    v
/auth/callback reads return_to, redirects to blockmediacorp.com#access_token=...
    |
    v
Auth client on blockmediacorp.com picks up tokens automatically
```

### Changes

**1. Create `src/pages/AuthCallback.tsx`**
A lightweight page that checks for a `return_to` query parameter. If present, it redirects to that URL while preserving the token hash fragment. If no `return_to` (user is already on the correct domain), it redirects to the home page.

**2. Update `src/App.tsx`**
Add a route: `/auth/callback` pointing to the new `AuthCallback` page.

**3. Update `src/components/AuthModal.tsx`**
In `handleGoogleSignIn`, detect if the app is running on a custom domain (not `*.lovable.app`). If so, set the `redirect_uri` to `https://orbit-news-feed.lovable.app/auth/callback?return_to=${window.location.origin}` so the OAuth flow goes through the whitelisted Lovable domain and bounces back.

### Technical Details

- The authentication client library automatically detects tokens in the URL hash on page load, so no extra token-handling code is needed on the blockmediacorp.com side.
- The `return_to` parameter is validated to only allow HTTPS URLs to prevent open redirect vulnerabilities.
- When running on the Lovable preview/published domain, the current behavior is unchanged (direct redirect, no relay needed).

