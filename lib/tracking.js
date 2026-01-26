// Frontend tracking service - Dual tracking: Custom Analytics + GA4

// Import GA4 tracking functions
import {
  trackPageViewGA4,
  trackPromptClickGA4,
  trackInstagramClickGA4,
  trackSearchGA4,
  trackFilterApplyGA4,
  trackCopyPromptGA4,
  trackDownloadImageGA4,
  trackButtonClickGA4
} from './ga4';

// Get API URL
const getApiUrl = () => {
  // Priority: 1. Environment variable, 2. Production URL
  // Only use localhost if explicitly set via environment variable
  return process.env.NEXT_PUBLIC_API_URL || 'https://aitrendpromt.onrender.com';
};

// Generate or get session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get current page
const getCurrentPage = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

// Get referrer
const getReferrer = () => {
  if (typeof window === 'undefined') return null;
  return document.referrer || null;
};

// Track an event
export async function trackEvent(eventType, eventData = {}) {
  // Don't track in server-side rendering
  if (typeof window === 'undefined') return;

  try {
    const API_URL = getApiUrl();
    const sessionId = getSessionId();
    const page = getCurrentPage();
    const referrer = getReferrer();

    // Send tracking event (fire and forget - don't block UI)
    // Use AbortController with timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        page,
        referrer,
        eventData,
        sessionId
      }),
      keepalive: true, // Keep request alive even if page unloads
      signal: controller.signal
    })
    .then(() => clearTimeout(timeoutId))
    .catch(err => {
      clearTimeout(timeoutId);
      // Silently fail - don't break user experience
      if (err.name !== 'AbortError') {
        console.debug('Analytics tracking failed:', err);
      }
    });
  } catch (error) {
    // Silently fail - don't break user experience
    console.debug('Analytics error:', error);
  }
}

// Convenience functions for common events

// Track page view (for custom analytics only - GA4 handles page views automatically)
export function trackPageView(pageName = null) {
  const page = pageName || getCurrentPage();
  
  // Only track in custom analytics
  // GA4 page views are handled automatically by GA4PageViewTracker component
  trackEvent('page_view', {
    pageName: page
  });
}

// Track prompt click
export function trackPromptClick(promptSlug, promptTitle, promptCategory) {
  // Custom analytics
  trackEvent('prompt_click', {
    promptSlug,
    promptTitle,
    promptCategory
  });
  
  // GA4 tracking
  trackPromptClickGA4(promptSlug, promptTitle, promptCategory);
}

// Track button click
export function trackButtonClick(buttonName, buttonLocation) {
  // Custom analytics
  trackEvent('button_click', {
    buttonName,
    buttonLocation
  });
  
  // GA4 tracking
  trackButtonClickGA4(buttonName, buttonLocation);
}

// Track Instagram click
export function trackInstagramClick(location) {
  // Custom analytics
  trackEvent('instagram_click', {
    instagramLocation: location // header, cta, footer, detail_page, etc.
  });
  
  // GA4 tracking
  trackInstagramClickGA4(location);
}

// Track search
export function trackSearch(searchQuery) {
  // Custom analytics
  trackEvent('search', {
    searchQuery
  });
  
  // GA4 tracking
  trackSearchGA4(searchQuery);
}

// Track filter apply
export function trackFilterApply(filterType, filterValue) {
  // Custom analytics
  trackEvent('filter_apply', {
    filterType,
    filterValue
  });
  
  // GA4 tracking
  trackFilterApplyGA4(filterType, filterValue);
}

// Track copy prompt
export function trackCopyPrompt(promptSlug) {
  // Custom analytics
  trackEvent('copy_prompt', {
    actionType: 'copy',
    resourceType: 'prompt',
    promptSlug
  });
  
  // GA4 tracking
  trackCopyPromptGA4(promptSlug);
}

// Track image download
export function trackDownloadImage(imageType, promptSlug = null) {
  // Custom analytics
  trackEvent('download_image', {
    actionType: 'download',
    resourceType: 'image',
    imageType, // before, after, example, input
    promptSlug
  });
  
  // GA4 tracking
  trackDownloadImageGA4(imageType, promptSlug);
}

