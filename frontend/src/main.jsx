import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';

// Toggle analytics based on environment variable
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Create mock PostHog client when disabled
const mockPostHog = {
  capture: () => {},
  identify: () => {},
  reset: () => {},
  register: () => {},
  opt_in_capturing: () => {},
  opt_out_capturing: () => {},
};

let posthogClient;

if (ENABLE_ANALYTICS) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,  
    autocapture: true,
    capture_pageview: true,
    opt_out_useragent_filter: true,
  });
  posthogClient = posthog;
  console.log('✅ Frontend PostHog analytics enabled');
} else {
  posthogClient = mockPostHog;
  console.log('⚠️  Frontend PostHog analytics disabled');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthogClient}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
