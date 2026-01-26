// API utility functions with retry logic and error handling

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff(fn, attempts = DEFAULT_RETRY_ATTEMPTS, delay = DEFAULT_RETRY_DELAY) {
  let lastError;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (i === attempts - 1) {
        throw error;
      }
      
      // Exponential backoff: delay * 2^i
      const backoffDelay = delay * Math.pow(2, i);
      await sleep(backoffDelay);
    }
  }
  
  throw lastError;
}

/**
 * Safe fetch with timeout and error handling
 */
async function safeFetch(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.status = 408;
      throw timeoutError;
    }
    
    throw error;
  }
}

/**
 * Fetch with retry logic
 */
export async function fetchWithRetry(url, options = {}, retryAttempts = DEFAULT_RETRY_ATTEMPTS) {
  return retryWithBackoff(
    () => safeFetch(url, options),
    retryAttempts
  );
}

/**
 * Get cached data or fetch with fallback
 */
export function getCachedData(key, maxAge = 60000) {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Set cached data
 */
export function setCachedData(key, data) {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error writing cache:', error);
    // If storage is full, try to clear old cache
    try {
      const keys = Object.keys(localStorage);
      for (let i = 0; i < Math.min(10, keys.length); i++) {
        localStorage.removeItem(keys[i]);
      }
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache() {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach((key) => {
      if (key.startsWith('cache_')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            if (now - timestamp > 3600000) { // 1 hour
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

