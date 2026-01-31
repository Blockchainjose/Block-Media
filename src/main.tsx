import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog only if the API key exists
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost || "https://us.i.posthog.com",
    defaults: '2025-11-30',  // ⬅️ ADDED: Configuration snapshot date
    person_profiles: "identified_only",
    
    // Pageview and pageleave tracking (pageleave includes scroll depth automatically)
    capture_pageview: true,
    capture_pageleave: true,  // ✅ Already enabled - this captures scroll depth too
    
    // ⬅️ ADDED: Autocapture for better event tracking
    autocapture: true,
  });
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
