/**
 * Vercel Speed Insights initialization
 * This script loads and initializes Speed Insights for the site
 */

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the DOM is ready
if (typeof window !== 'undefined') {
  injectSpeedInsights({
    debug: false, // Set to true to see debug logs in console during development
  });
}
