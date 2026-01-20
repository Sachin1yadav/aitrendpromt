import promptsData from "@/data/prompts.json";

export function getAllPrompts() {
  return promptsData;
}

export function getPromptBySlug(slug) {
  return getAllPrompts().find((p) => p.slug === slug);
}

export function getPromptsByCategory(category) {
  return getAllPrompts().filter((p) => p.category === category);
}

export function searchPrompts(query) {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return getAllPrompts().filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

