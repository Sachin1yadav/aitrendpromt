// Get API URL - works in both server and client
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';
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
    
    // Fetch options - different for server vs client
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 60 } } // Server-side: Next.js revalidation
      : { cache: 'no-store' }; // Client-side: Always fetch fresh data
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prompts');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}

// Fetch prompt by slug
export async function getPromptBySlug(slug) {
  try {
    const API_URL = getApiUrl();
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 60 } } // Server-side
      : { cache: 'no-store' }; // Client-side
    
    const response = await fetch(`${API_URL}/api/prompts/${slug}`, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch prompt');
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return null;
  }
}

// Fetch all slugs for static generation
export async function getAllSlugs() {
  try {
    const API_URL = getApiUrl();
    const fetchOptions = typeof window === 'undefined' 
      ? { next: { revalidate: 3600 } } // Server-side: Revalidate every hour
      : { cache: 'no-store' }; // Client-side
    
    const response = await fetch(`${API_URL}/api/prompts/slugs/all`, fetchOptions);
    
    if (!response.ok) {
      throw new Error('Failed to fetch slugs');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching slugs:', error);
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
    const response = await fetch(`${API_URL}/api/admin/prompts/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminSecret}`
      },
      body: JSON.stringify(promptData)
    });
    
    const data = await response.json();
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

