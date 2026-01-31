import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog only if the API key exists
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "https://us.i.posthog.com",  // ⬅️ Direct URL, no proxy
    defaults: '2025-11-30',
    person_profiles: "identified_only",
    
    // Pageview and pageleave tracking
    capture_pageview: true,
    capture_pageleave: true,
    
    // Autocapture
    autocapture: true,
  });
  
  // ⬅️ ADDED: Make posthog available globally for debugging
  window.posthog = posthog;
}

createRoot(document.getElementById("root")!).render(
  posthogKey ? (
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  ) : (
    <App />
  )
);
