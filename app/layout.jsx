import "./globals.css";
import GA4Script from "@/components/GA4Script";
import GA4PageViewTracker from "@/components/GA4PageViewTracker";
import StructuredData from "@/components/StructuredData";
import FAQSchema from "./faq-schema";
import ErrorBoundary from "@/components/ErrorBoundary";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";

// Force dynamic rendering to handle useSearchParams in child pages
export const dynamic = 'force-dynamic';

export const metadata = {
  metadataBase: new URL("https://www.aitrendpromt.com"),
  title: {
    default: "AItrendpromt - Discover Viral AI Image Prompt Trends | Free AI Prompts",
    template: "%s | AItrendpromt"
  },
  description: "Discover trending AI image generation prompts with real before/after examples. Browse viral prompts for ChatGPT, Gemini, Midjourney, and Leonardo AI. Filter by style, category, and get model recommendations. Free AI prompts with visual examples. Learn prompt engineering and create stunning AI art.",
  keywords: [
    "AI prompts",
    "AI image generation",
    "trending AI prompts",
    "ChatGPT prompts",
    "Midjourney prompts",
    "Gemini prompts",
    "Leonardo AI prompts",
    "DALL-E prompts",
    "AI art prompts",
    "prompt engineering",
    "viral AI prompts",
    "free AI prompts",
    "AI image generator prompts",
    "best AI prompts",
    "AI prompt library",
    "AI art generation",
    "text to image AI",
    "AI image creation",
    "prompt examples",
    "AI prompt ideas",
    "creative AI prompts",
    "AI art styles",
    "Ghibli style prompts",
    "Pixar style prompts",
    "anime AI prompts",
    "realistic AI prompts",
    "AI portrait prompts",
    "AI image trends",
    "how to create AI images",
    "AI prompt tutorial",
    "AI art inspiration"
  ].join(", "),
  authors: [{ name: "AItrendpromt" }],
  creator: "AItrendpromt",
  publisher: "AItrendpromt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aitrendpromt.com",
    siteName: "AItrendpromt",
    title: "AItrendpromt - Discover Viral AI Image Prompt Trends | Free AI Prompts",
    description: "Discover trending AI image generation prompts with real before/after examples. Browse viral prompts for ChatGPT, Gemini, Midjourney, and Leonardo AI. Free AI prompts with visual comparisons.",
    images: [
      {
        url: "https://www.aitrendpromt.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AItrendpromt - AI Image Prompt Trends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AItrendpromt - Discover Viral AI Image Prompt Trends",
    description: "Discover trending AI image generation prompts with real before/after examples. Free AI prompts with visual comparisons.",
    creator: "@aitrendpromt",
    images: ["https://www.aitrendpromt.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.aitrendpromt.com",
  },
  category: "Technology",
  classification: "AI Tools, Image Generation, Creative Tools",
  other: {
    "theme-color": "#4F46E5",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "AItrendpromt",
    "application-name": "AItrendpromt",
    "msapplication-TileColor": "#4F46E5",
    "geo.region": "US",
    "geo.placename": "United States",
    "language": "English",
    "revisit-after": "1 days",
    "distribution": "global",
    "rating": "general",
  },
};

// Organization and Website structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AItrendpromt",
  "url": "https://www.aitrendpromt.com",
  "logo": "https://www.aitrendpromt.com/logo.png",
  "description": "Discover trending AI image generation prompts with real before/after examples. Free AI prompts for ChatGPT, Gemini, Midjourney, and Leonardo AI.",
  "sameAs": [
    "https://www.instagram.com/aitrendpromt/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "url": "https://www.aitrendpromt.com"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AItrendpromt",
  "url": "https://www.aitrendpromt.com",
  "description": "Discover trending AI image generation prompts with real before/after examples. Free AI prompts for ChatGPT, Gemini, Midjourney, and Leonardo AI.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.aitrendpromt.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-US",
  "isAccessibleForFree": true
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.aitrendpromt.com"
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={breadcrumbSchema} />
        <FAQSchema />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <ErrorBoundary>
          <PerformanceOptimizer />
          <GA4Script />
          <GA4PageViewTracker />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
