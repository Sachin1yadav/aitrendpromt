import { getAllPrompts as fetchAllPrompts, getPromptBySlug as fetchPromptBySlug } from "./api";

// Server-side functions (for SSG/SSR)
export async function getAllPrompts() {
  try {
    return await fetchAllPrompts();
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }
}

export async function getPromptBySlug(slug) {
  try {
    return await fetchPromptBySlug(slug);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return null;
  }
}

export async function getPromptsByCategory(category) {
  try {
    return await fetchAllPrompts({ category });
  } catch (error) {
    console.error("Error fetching prompts by category:", error);
    return [];
  }
}

export async function searchPrompts(query) {
  if (!query.trim()) return [];
  try {
    return await fetchAllPrompts({ search: query });
  } catch (error) {
    console.error("Error searching prompts:", error);
    return [];
  }
}

