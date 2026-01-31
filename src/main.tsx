import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog only if the API key exists
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "/ingest",  // ⬅️ Use the reverse proxy path
    ui_host: "https://us.i.posthog.com",  // ⬅️ PostHog UI host (change to eu if needed)
    person_profiles: "identified_only",
    
    // Pageview and pageleave tracking
    capture_pageview: true,
    capture_pageleave: true,
    
    // ⬅️ ADDED: Scroll depth tracking
    capture_heatmaps: true,  // This enables scroll depth
    enable_heatmaps: true,
    
    // ⬅️ ADDED: Better autocapture
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
