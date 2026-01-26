import { fetchWithRetry, getCachedData, setCachedData } from './api-utils';

// Get API URL - works in both server and client
const getApiUrl = () => {
  // Priority: 1. Environment variable, 2. Production URL
  // Only use localhost if explicitly set via environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aitrendpromt.onrender.com';
  
  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 Using API URL:', apiUrl);
  }
  
  return apiUrl;
};

// Fetch all prompts with optional filters
export async function getAllPrompts(filters = {}) {
  try {
    const API_URL = getApiUrl();
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.primaryCategory) queryParams.append('primaryCategory', filters.primaryCategory);
    if (filters.style) {
      const styles = Array.isArray(filters.style) ? filters.style : [filters.style];
      styles.forEach(s => queryParams.append('style', s));
    }
    if (filters.pose) {
      const poses = Array.isArray(filters.pose) ? filters.pose : [filters.pose];
      poses.forEach(p => queryParams.append('pose', p));
    }
    if (filters.background) {
      const backgrounds = Array.isArray(filters.background) ? filters.background : [filters.background];
      backgrounds.forEach(b => queryParams.append('background', b));
    }
    if (filters.god) queryParams.append('god', filters.god);
    
    const url = `${API_URL}/api/prompts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const cacheKey = `prompts_${url}`;
    
    // Try to get from cache first (client-side only, 2 minute cache)
    if (typeof window !== 'undefined') {
      const cached = getCachedData(cacheKey, 120000);
      if (cached) {
        return cached;
      }
    }
    
    // Fetch options - different for server vs client
    // Note: Don't add Cache-Control header - it causes CORS issues
    // The cache: 'no-store' option is sufficient
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 60 } } // Server-side: Next.js revalidation
      : { cache: 'no-store' }; // Client-side: no-store is enough, no header needed
    
    // Use retry logic for client-side requests
    const response = typeof window !== 'undefined'
      ? await fetchWithRetry(url, fetchOptions, 2) // 2 retries for client
      : await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompts: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.data || [];
    
    // Cache the result (client-side only)
    if (typeof window !== 'undefined') {
      setCachedData(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    
    // Try to return cached data as fallback
    if (typeof window !== 'undefined') {
      // Reconstruct cache key - API_URL is not in scope here
      const API_URL = getApiUrl();
      const url = `${API_URL}/api/prompts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const cacheKey = `prompts_${url}`;
      const cached = getCachedData(cacheKey, 600000); // 10 minute stale cache
      if (cached) {
        console.log('Returning cached data due to error');
        return cached;
      }
    }
    
    // Return empty array as last resort
    return [];
  }
}

// Fetch prompt by slug
export async function getPromptBySlug(slug) {
  try {
    if (!slug) {
      return null;
    }
    
    const API_URL = getApiUrl();
    const url = `${API_URL}/api/prompts/${slug}`;
    const cacheKey = `prompt_${slug}`;
    
    // Try to get from cache first (client-side only, 5 minute cache)
    if (typeof window !== 'undefined') {
      const cached = getCachedData(cacheKey, 300000);
      if (cached) {
        return cached;
      }
    }
    
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 60 } } // Server-side
      : { cache: 'no-store' }; // Client-side: no-store is enough, no header needed
    
    // Use retry logic for client-side requests
    const response = typeof window !== 'undefined'
      ? await fetchWithRetry(url, fetchOptions, 2) // 2 retries for client
      : await fetch(url, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch prompt: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.data || null;
    
    // Cache the result (client-side only)
    if (typeof window !== 'undefined' && result) {
      setCachedData(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching prompt:', error);
    
    // Try to return cached data as fallback
    if (typeof window !== 'undefined') {
      const cacheKey = `prompt_${slug}`;
      const cached = getCachedData(cacheKey, 1800000); // 30 minute stale cache
      if (cached) {
        console.log('Returning cached prompt due to error');
        return cached;
      }
    }
    
    return null;
  }
}

// Fetch all slugs for static generation
export async function getAllSlugs() {
  try {
    const API_URL = getApiUrl();
    const url = `${API_URL}/api/prompts/slugs/all`;
    const cacheKey = 'all_slugs';
    
    // Try to get from cache first (client-side only, 1 hour cache)
    if (typeof window !== 'undefined') {
      const cached = getCachedData(cacheKey, 3600000);
      if (cached) {
        return cached;
      }
    }
    
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 3600 } } // Server-side: Revalidate every hour
      : { cache: 'no-store' }; // Client-side: no-store is enough, no header needed
    
    // Use retry logic for client-side requests
    const response = typeof window !== 'undefined'
      ? await fetchWithRetry(url, fetchOptions, 2) // 2 retries for client
      : await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch slugs: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.data || [];
    
    // Cache the result (client-side only)
    if (typeof window !== 'undefined') {
      setCachedData(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching slugs:', error);
    
    // Try to return cached data as fallback
    if (typeof window !== 'undefined') {
      const cached = getCachedData('all_slugs', 7200000); // 2 hour stale cache
      if (cached) {
        console.log('Returning cached slugs due to error');
        return cached;
      }
    }
    
    return [];
  }
}

// Admin API functions
export async function createPrompt(promptData, adminSecret) {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/admin/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminSecret}`
      },
      body: JSON.stringify(promptData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating prompt:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePrompt(slug, promptData, adminSecret) {
  try {
    const API_URL = getApiUrl();
    console.log('Updating prompt:', slug, 'Data:', promptData);
    const response = await fetch(`${API_URL}/api/admin/prompts/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminSecret}`
      },
      body: JSON.stringify(promptData),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update prompt');
    }
    
    const data = await response.json();
    console.log('Update response:', data);
    return data;
  } catch (error) {
    console.error('Error updating prompt:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePrompt(slug, adminSecret) {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/admin/prompts/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminSecret}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return { success: false, error: error.message };
  }
}

