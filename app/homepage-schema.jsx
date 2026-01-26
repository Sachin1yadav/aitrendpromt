import StructuredData from "@/components/StructuredData";

// Collection schema for homepage
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AI Image Generation Prompts Collection",
  "description": "Browse trending AI image generation prompts with real before/after examples. Free prompts for ChatGPT, Gemini, Midjourney, and Leonardo AI.",
  "url": "https://www.aitrendpromt.com",
  "mainEntity": {
    "@type": "ItemList",
    "name": "AI Prompts Collection",
    "description": "Collection of trending AI image generation prompts"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.aitrendpromt.com"
      }
    ]
  }
};

export default function HomepageSchema() {
  return <StructuredData data={collectionSchema} />;
}

