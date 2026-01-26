// Google Analytics 4 (GA4) Tracking Service

// Initialize GA4
export const initGA4 = (measurementId) => {
  if (typeof window === 'undefined' || !measurementId) {
    return;
  }

  // Check if already initialized
  if (window.gtag) {
    return;
  }

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true // GA4 automatically sends initial page view
  });

  console.log('GA4 initialized with ID:', measurementId);
};

// Track page view
export const trackPageViewGA4 = (pagePath, pageTitle = null) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href
  });
};

// Track custom event
export const trackEventGA4 = (eventName, eventParams = {}) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, eventParams);
};

// Track prompt click
export const trackPromptClickGA4 = (promptSlug, promptTitle, promptCategory) => {
  trackEventGA4('prompt_click', {
    prompt_slug: promptSlug,
    prompt_title: promptTitle,
    prompt_category: promptCategory,
    event_category: 'Engagement',
    event_label: promptTitle
  });
};

// Track Instagram click
export const trackInstagramClickGA4 = (location) => {
  trackEventGA4('instagram_click', {
    instagram_location: location,
    event_category: 'Social',
    event_label: `Instagram - ${location}`
  });
};

// Track search
export const trackSearchGA4 = (searchQuery) => {
  trackEventGA4('search', {
    search_term: searchQuery,
    event_category: 'Search',
    event_label: searchQuery
  });
};

// Track filter apply
export const trackFilterApplyGA4 = (filterType, filterValue) => {
  trackEventGA4('filter_apply', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'Filter',
    event_label: `${filterType}: ${filterValue}`
  });
};

// Track copy prompt
export const trackCopyPromptGA4 = (promptSlug) => {
  trackEventGA4('copy_prompt', {
    prompt_slug: promptSlug,
    event_category: 'Engagement',
    event_label: 'Copy Prompt'
  });
};

// Track image download
export const trackDownloadImageGA4 = (imageType, promptSlug = null) => {
  trackEventGA4('download_image', {
    image_type: imageType,
    prompt_slug: promptSlug,
    event_category: 'Download',
    event_label: `Download ${imageType} image`
  });
};

// Track button click
export const trackButtonClickGA4 = (buttonName, buttonLocation) => {
  trackEventGA4('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    event_category: 'Interaction',
    event_label: `${buttonName} - ${buttonLocation}`
  });
};

