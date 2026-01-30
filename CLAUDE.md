# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Block Media is an AI-powered financial news platform with political bias detection. Built with React, TypeScript, and Vite, it provides real-time stock market, cryptocurrency, and commodities news with AI-powered summaries and multi-perspective analysis.

## Commands

```bash
npm run dev          # Start dev server on localhost:8080
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run preview      # Preview production build
```

Test files are located in `src/**/*.{test,spec}.{ts,tsx}` and use Vitest with jsdom environment.

## Architecture

### Frontend Stack
- **React 18** with TypeScript and Vite
- **shadcn-ui** (Radix UI primitives) for components
- **Tailwind CSS** for styling
- **React Query** (@tanstack/react-query) for server state management
- **React Router v6** for routing

### Backend Integration
- **Supabase** for database, auth, and edge functions
- Supabase client: `src/integrations/supabase/client.ts`
- Edge functions in `supabase/functions/`:
  - `fetch-news` - Financial news API
  - `fetch-crypto-news` - Cryptocurrency news
  - `fetch-quotes` - Real-time price quotes
  - `fetch-historical` - Historical price data
  - `analyze-article` - AI article analysis

### Data Flow Pattern
```
Pages/Components → Custom Hooks → React Query → Supabase Edge Functions
```

Custom hooks in `src/hooks/` wrap React Query with caching (5-10 min stale time). Example:
- `useNews()` - Financial news articles
- `useCryptoNews()` - Crypto-specific news
- `useQuotes()` - Real-time price data

### Key Directories
- `src/pages/` - Route components (Index, Dashboard, Markets, Crypto, etc.)
- `src/components/` - Reusable components
- `src/components/ui/` - shadcn-ui components
- `src/hooks/` - React Query data fetching hooks
- `src/types/` - TypeScript interfaces

### Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- `VITE_PUBLIC_POSTHOG_KEY` (optional) - PostHog analytics

### Path Aliases
Use `@/` for imports from `src/`:
```typescript
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
```

### Adding Routes
Add new routes in `src/App.tsx` above the catch-all `"*"` route.

### Adding shadcn-ui Components
Components are pre-configured in `components.json`. The UI components use CSS variables defined in `src/index.css` and custom bias colors (`bias-left`, `bias-center`, `bias-right`) in `tailwind.config.ts`.
