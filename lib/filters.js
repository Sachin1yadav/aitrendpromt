// Filter configuration and utilities

export const PRIMARY_CATEGORIES = [
  { id: "boy", label: "Boy" },
  { id: "girl", label: "Girl" },
  { id: "baby", label: "Baby" },
  { id: "man", label: "Man" },
  { id: "woman", label: "Woman" },
  { id: "with-god", label: "With God" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "pet", label: "Pet" },
  { id: "cartoon-anime", label: "Cartoon / Anime" },
];

export const STYLE_FILTERS = [
  { id: "ghibli", label: "Ghibli" },
  { id: "pixar", label: "Pixar" },
  { id: "anime", label: "Anime" },
  { id: "disney", label: "Disney" },
  { id: "3d-render", label: "3D Render" },
  { id: "realistic", label: "Realistic" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "watercolor", label: "Watercolor" },
];

export const POSE_FILTERS = [
  { id: "portrait", label: "Portrait" },
  { id: "full-body", label: "Full Body" },
  { id: "cinematic", label: "Cinematic" },
  { id: "festival", label: "Festival" },
  { id: "temple", label: "Temple" },
  { id: "street", label: "Street" },
  { id: "wedding", label: "Wedding" },
  { id: "travel", label: "Travel" },
];

export const BACKGROUND_FILTERS = [
  { id: "indian-temple", label: "Indian Temple" },
  { id: "heaven", label: "Heaven" },
  { id: "city", label: "City" },
  { id: "village", label: "Village" },
  { id: "nature", label: "Nature" },
  { id: "studio", label: "Studio" },
];

export const GOD_FILTERS = [
  { id: "krishna", label: "Krishna" },
  { id: "ram", label: "Ram" },
  { id: "shiva", label: "Shiva" },
  { id: "hanuman", label: "Hanuman" },
  { id: "jesus", label: "Jesus" },
  { id: "buddha", label: "Buddha" },
  { id: "sai-baba", label: "Sai Baba" },
];

// Filter state structure
export function createEmptyFilters() {
  return {
    primaryCategory: null,
    style: [],
    pose: [],
    background: [],
    god: null,
  };
}

// Check if prompt matches filters (strict primary category matching)
export function matchesFilters(prompt, filters) {
  // If no filters, show all prompts
  if (!filters.primaryCategory && filters.style.length === 0 && filters.pose.length === 0 && filters.background.length === 0 && !filters.god) {
    return true;
  }

  let matches = true;

  // Primary category match (REQUIRED - strict matching only)
  if (filters.primaryCategory) {
    // Only match if prompt has the exact primary category
    const categoryMatch = prompt.filters?.primaryCategory === filters.primaryCategory;
    
    if (!categoryMatch) {
      return false; // Strict: must have matching primary category
    }
  }

  // Style match (any selected style should match)
  if (filters.style.length > 0) {
    hasAnyFilter = true;
    const hasMatchingStyle = filters.style.some((style) =>
      prompt.filters?.style?.includes(style) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(style.toLowerCase())) ||
      prompt.title?.toLowerCase().includes(style.toLowerCase())
    );
    if (!hasMatchingStyle) {
      matches = false;
    }
  }

  // Pose match (any selected pose should match)
  if (filters.pose.length > 0) {
    hasAnyFilter = true;
    const hasMatchingPose = filters.pose.some((pose) =>
      prompt.filters?.pose?.includes(pose) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(pose.toLowerCase())) ||
      prompt.description?.toLowerCase().includes(pose.toLowerCase())
    );
    if (!hasMatchingPose) {
      matches = false;
    }
  }

  // Background match (any selected background should match)
  if (filters.background.length > 0) {
    hasAnyFilter = true;
    const hasMatchingBackground = filters.background.some((bg) =>
      prompt.filters?.background?.includes(bg) ||
      prompt.description?.toLowerCase().includes(bg.toLowerCase().replace('-', ' '))
    );
    if (!hasMatchingBackground) {
      matches = false;
    }
  }

  // God match (exact match required, only if "with-god" is selected)
  if (filters.god && filters.primaryCategory === "with-god") {
    hasAnyFilter = true;
    if (prompt.filters?.god !== filters.god) {
      // Fallback: check if description mentions the god
      const godName = filters.god.replace('-', ' ').toLowerCase();
      if (!prompt.description?.toLowerCase().includes(godName)) {
        matches = false;
      }
    }
  }

  return matches;
}

// Get active filter count
export function getActiveFilterCount(filters) {
  let count = 0;
  if (filters.primaryCategory) count++;
  if (filters.style.length > 0) count += filters.style.length;
  if (filters.pose.length > 0) count += filters.pose.length;
  if (filters.background.length > 0) count += filters.background.length;
  if (filters.god) count++;
  return count;
}

// Generate prompt based on filters
export function generatePromptFromFilters(filters) {
  if (!filters.primaryCategory) return null;

  const parts = [];

  // Primary category
  const categoryLabels = {
    boy: "a young Indian boy",
    girl: "a young Indian girl",
    baby: "an Indian baby",
    man: "an Indian man",
    woman: "an Indian woman",
    "with-god": filters.god ? `a person with ${getGodLabel(filters.god)}` : "a person with God",
    couple: "an Indian couple",
    family: "an Indian family",
    pet: "an Indian pet",
    "cartoon-anime": "a cartoon/anime character",
  };

  parts.push(categoryLabels[filters.primaryCategory] || "a person");

  // Style
  if (filters.style.length > 0) {
    const styleLabels = {
      ghibli: "Studio Ghibli style",
      pixar: "Pixar animation style",
      anime: "anime art style",
      disney: "Disney animation style",
      "3d-render": "3D rendered",
      realistic: "realistic photography style",
      "oil-painting": "oil painting style",
      watercolor: "watercolor art style",
    };
    const styles = filters.style.map((s) => styleLabels[s] || s).join(", ");
    parts.push(`illustrated in ${styles}`);
  }

  // Pose/Scene
  if (filters.pose.length > 0) {
    const poseLabels = {
      portrait: "portrait",
      "full-body": "full body",
      cinematic: "cinematic composition",
      festival: "festival scene",
      temple: "temple setting",
      street: "street scene",
      wedding: "wedding scene",
      travel: "travel scene",
    };
    const poses = filters.pose.map((p) => poseLabels[p] || p).join(", ");
    parts.push(poses);
  }

  // Background
  if (filters.background.length > 0) {
    const bgLabels = {
      "indian-temple": "Indian temple",
      heaven: "heavenly",
      city: "urban city",
      village: "village",
      nature: "natural",
      studio: "studio",
    };
    const backgrounds = filters.background.map((bg) => bgLabels[bg] || bg).join(", ");
    parts.push(`${backgrounds} background`);
  }

  // God (if selected)
  if (filters.god && filters.primaryCategory === "with-god") {
    parts.push(`with ${getGodLabel(filters.god)}`);
  }

  // Add quality descriptors
  parts.push("soft lighting, cinematic composition, high detail, 4K quality");

  return parts.join(", ") + ".";
}

function getGodLabel(godId) {
  const god = GOD_FILTERS.find((g) => g.id === godId);
  return god ? god.label : godId;
}

// URL state management
export function filtersToQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.primaryCategory) {
    params.set("category", filters.primaryCategory);
  }

  if (filters.style.length > 0) {
    params.set("style", filters.style.join(","));
  }

  if (filters.pose.length > 0) {
    params.set("pose", filters.pose.join(","));
  }

  if (filters.background.length > 0) {
    params.set("background", filters.background.join(","));
  }

  if (filters.god) {
    params.set("god", filters.god);
  }

  return params.toString();
}

export function queryStringToFilters(searchParams) {
  const filters = createEmptyFilters();

  if (searchParams.get("category")) {
    filters.primaryCategory = searchParams.get("category");
  }

  if (searchParams.get("style")) {
    filters.style = searchParams.get("style").split(",").filter(Boolean);
  }

  if (searchParams.get("pose")) {
    filters.pose = searchParams.get("pose").split(",").filter(Boolean);
  }

  if (searchParams.get("background")) {
    filters.background = searchParams.get("background").split(",").filter(Boolean);
  }

  if (searchParams.get("god")) {
    filters.god = searchParams.get("god");
  }

  return filters;
}

