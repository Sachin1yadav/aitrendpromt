import { getAllSlugs } from "@/lib/api";

const baseUrl = "https://www.aitrendpromt.com";

export default async function sitemap() {
  try {
    // Get all prompt slugs
    const slugs = await getAllSlugs();
    
    // Create sitemap entries for all prompts
    const promptEntries = slugs.map((slug) => ({
      url: `${baseUrl}/trend/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];

    return [...staticPages, ...promptEntries];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}

