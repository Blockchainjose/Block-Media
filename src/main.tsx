import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog only if the API key exists
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "/ingest",  // ⬅️ CHANGED: Use reverse proxy
    ui_host: "https://us.i.posthog.com",  // ⬅️ ADDED: PostHog UI host
    person_profiles: "identified_only",
    
    // Pageview and pageleave tracking
    capture_pageview: true,
    capture_pageleave: true,  // Already had this ✅
    
    // ⬅️ ADDED: Scroll depth tracking
    scroll_root_selector: ['body'],
    
    // ⬅️ ADDED: Better event capture
    autocapture: true,
    
    // Optional but recommended
    session_recording: {
      recordCrossOriginIframes: false
    }
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
