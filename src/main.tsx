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
    person_profiles: "identified_only",
    
    // Pageview and pageleave tracking
    capture_pageview: true,
    capture_pageleave: true,  // ✅ Already enabled
    
    // ⬅️ FIX: Scroll depth tracking
    capture_heatmaps: true,
    enable_heatmaps: true,
    
    // Better event capture
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
