// Performance monitoring and optimization utilities

/**
 * Measure and log performance metrics
 */
export function measurePerformance(name, fn) {
  if (typeof window === 'undefined') return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;
  
  // Log slow operations (> 100ms)
  if (duration > 100) {
    console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
  }
  
  // Track in GA4 if available
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(duration),
    });
  }
  
  return result;
}

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Preload critical resources
 */
export function preloadResource(href, as, crossorigin = false) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Prefetch resources for faster navigation
 */
export function prefetchResource(href) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(imgElement, src) {
  if (typeof window === 'undefined' || !imgElement) return;
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    });
    
    observer.observe(imgElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imgElement.src = src;
  }
}

/**
 * Clear performance marks
 */
export function clearPerformanceMarks() {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.clearMarks();
      performance.clearMeasures();
    } catch (e) {
      // Ignore errors
    }
  }
}

