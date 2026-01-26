import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instagram } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import ModelRatings from "@/components/ModelRatings";
import ExampleImagesGallery from "@/components/ExampleImagesGallery";
import ImagesToUseGallery from "@/components/ImagesToUseGallery";
import DownloadImageButton from "@/components/DownloadImageButton";
import PromptDetailClient from "./PromptDetailClient";
import InstagramLink from "@/components/InstagramLink";
import StructuredData from "@/components/StructuredData";
import { getPromptBySlug, getAllSlugs } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    return {
      title: "Prompt Not Found - AItrendpromt",
      description: "The requested AI prompt trend was not found.",
    };
  }

  const title = `${prompt.title} - AI Prompt Trend | AItrendpromt`;
  const description = `${prompt.description} Best for ${prompt.bestModel}. See before/after examples and download reference images. Free AI prompt with visual examples. Learn how to create ${prompt.title} style AI images.`;

  const keywords = [
    prompt.title,
    `${prompt.title} AI prompt`,
    "AI prompt",
    prompt.bestModel,
    `${prompt.bestModel} prompt`,
    prompt.category,
    ...(prompt.tags || []),
    "free AI prompts",
    "AI image generation",
    "trending prompts",
    "AI art prompt",
    "text to image AI",
    "AI image generator",
    "prompt engineering",
    "AI art creation",
    "how to create AI images",
    ...(prompt.filters?.style || []).map(s => `${s} style prompt`),
    ...(prompt.filters?.pose || []).map(p => `${p} pose prompt`),
    ...(prompt.filters?.background || []).map(b => `${b} background prompt`),
  ].filter(Boolean).join(", ");

  const imageUrl = prompt.afterImage || prompt.beforeImage;
  const publishedTime = prompt.createdAt ? new Date(prompt.createdAt).toISOString() : new Date().toISOString();
  const modifiedTime = prompt.updatedAt ? new Date(prompt.updatedAt).toISOString() : publishedTime;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "AItrendpromt" }],
    openGraph: {
      title,
      description,
      url: `https://www.aitrendpromt.com/trend/${slug}`,
      siteName: "AItrendpromt",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${prompt.title} - AI Generated Result`,
        },
      ],
      type: "article",
      publishedTime,
      modifiedTime,
      section: prompt.category || "AI Prompts",
      tags: prompt.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@aitrendpromt",
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
      canonical: `https://www.aitrendpromt.com/trend/${slug}`,
    },
  };
}

export default async function PromptDetailPage({ params }) {
  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string') {
      notFound();
    }
    
    const prompt = await getPromptBySlug(slug);

    if (!prompt) {
      notFound();
    }

  // Generate structured data for this prompt
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": prompt.title,
    "description": prompt.description,
    "image": [
      prompt.afterImage || prompt.beforeImage,
      ...(prompt.exampleImages || []).slice(0, 3)
    ],
    "datePublished": prompt.createdAt ? new Date(prompt.createdAt).toISOString() : new Date().toISOString(),
    "dateModified": prompt.updatedAt ? new Date(prompt.updatedAt).toISOString() : (prompt.createdAt ? new Date(prompt.createdAt).toISOString() : new Date().toISOString()),
    "author": {
      "@type": "Organization",
      "name": "AItrendpromt",
      "url": "https://www.aitrendpromt.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AItrendpromt",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aitrendpromt.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.aitrendpromt.com/trend/${slug}`
    },
    "articleSection": prompt.category || "AI Prompts",
    "keywords": [
      prompt.title,
      "AI prompt",
      prompt.bestModel,
      ...(prompt.tags || [])
    ].join(", "),
    "inLanguage": "en-US"
  };

  const itemPageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": prompt.title,
    "description": prompt.description,
    "url": `https://www.aitrendpromt.com/trend/${slug}`,
    "mainEntity": {
      "@type": "CreativeWork",
      "name": prompt.title,
      "description": prompt.description,
      "image": prompt.afterImage || prompt.beforeImage,
      "creator": {
        "@type": "Organization",
        "name": "AItrendpromt"
      }
    }
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
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": prompt.category === "trending" ? "Trending Prompts" : prompt.category === "new" ? "New Prompts" : "Archived Prompts",
        "item": `https://www.aitrendpromt.com/?category=${prompt.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": prompt.title,
        "item": `https://www.aitrendpromt.com/trend/${slug}`
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use ${prompt.title} AI Prompt`,
    "description": `Step-by-step guide to create ${prompt.title} style AI images using ${prompt.bestModel}`,
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Copy the Prompt",
        "text": "Copy the prompt text above and paste it into your AI image generator"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Download Reference Images",
        "text": "Download and upload the reference images shown above as input"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Use Recommended AI Model",
        "text": `Use the recommended AI model (${prompt.bestModel}) for best results`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Reference Example Images",
        "text": "Reference the example images to understand the expected style and composition"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Experiment with Variations",
        "text": "Experiment with variations by adjusting colors, styles, or details"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": prompt.bestModel
      }
    ]
  };

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={itemPageSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={howToSchema} />
      <PromptDetailClient prompt={prompt} />
      <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AItrendpromt</h1>
              <p className="mt-0.5 text-xs text-gray-600">Discover viral AI prompts with real examples</p>
            </div>
            <div className="flex items-center gap-3">
              <InstagramLink
                location="detail_header"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">Follow</span>
              </InstagramLink>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
          <p className="text-base text-gray-600">{prompt.description}</p>
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Before & After and Prompt - Side by Side */}
        <section className="mb-10 md:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Before & After */}
            <div className="w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Before & After</h2>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="group relative w-full">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 uppercase">Before</span>
                    <DownloadImageButton 
                      imageUrl={prompt.beforeImage || "/placeholder.jpg"} 
                      filename={`${prompt.slug}-before.jpg`}
                      variant="ghost"
                      size="sm"
                      imageType="before"
                      promptSlug={prompt.slug}
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm group-hover:border-blue-500 transition-all w-full" style={{ aspectRatio: '9/16' }}>
                    <Image
                      src={prompt.beforeImage || "/placeholder.jpg"}
                      alt={`${prompt.title} - Before: Original input image for AI image generation prompt`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                      unoptimized={prompt.beforeImage?.includes('cloudinary.com')}
                    />
                  </div>
                </div>
                <div className="group relative w-full">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700 uppercase">After</span>
                    <DownloadImageButton 
                      imageUrl={prompt.afterImage || "/placeholder.jpg"} 
                      filename={`${prompt.slug}-after.jpg`}
                      variant="ghost"
                      size="sm"
                      imageType="after"
                      promptSlug={prompt.slug}
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border-2 border-green-400 shadow-sm group-hover:border-green-600 transition-all w-full" style={{ aspectRatio: '9/16' }}>
                    <Image
                      src={prompt.afterImage || "/placeholder.jpg"}
                      alt={`${prompt.title} - After: AI generated result using ${prompt.bestModel} prompt`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                      unoptimized={prompt.afterImage?.includes('cloudinary.com')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Prompt */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Prompt</h2>
              <div className="rounded-lg border-2 border-blue-200 bg-white p-4 shadow-md h-full flex flex-col">
                <div className="flex-grow overflow-y-auto mb-3 max-h-[500px]">
                  <pre className="whitespace-pre-wrap break-words text-sm text-gray-800 font-mono leading-relaxed">
                    {prompt.prompt}
                  </pre>
                </div>
                <CopyButton text={prompt.prompt} promptSlug={prompt.slug} className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Instagram CTA - Right After Prompt Section */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-gray-900">Want More Trending Prompts?</h3>
                <p className="text-xs text-gray-700">Follow us on Instagram for daily viral prompts & tutorials</p>
              </div>
            </div>
            <InstagramLink
              location="detail_cta"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @aitrendpromt</span>
            </InstagramLink>
          </div>
        </div>

        {/* Images You Should Use */}
        {prompt.imgshoulduse && prompt.imgshoulduse.length > 0 && (
          <div className="mt-10 md:mt-12 mb-8 pt-4">
            <ImagesToUseGallery 
              images={prompt.imgshoulduse} 
              title="Images You Should Use"
            />
          </div>
        )}

        {/* Example Output Images */}
        {prompt.exampleImages && prompt.exampleImages.length > 0 && (
          <div className="mb-8">
            <ExampleImagesGallery 
              images={prompt.exampleImages} 
              title="Example Output Images"
            />
          </div>
        )}

        {/* How to Use */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-900">How to Use This Trend</h3>
          <ul className="space-y-3 text-base text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold text-lg">1.</span>
              <span><strong>Copy the prompt</strong> above and paste it into your AI image generator</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold text-lg">2.</span>
              <span><strong>Download and upload</strong> the reference images shown above as input</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold text-lg">3.</span>
              <span><strong>Use the recommended AI model</strong> ({prompt.bestModel}) for best results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold text-lg">4.</span>
              <span><strong>Reference the example images</strong> to understand the expected style and composition</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold text-lg">5.</span>
              <span><strong>Experiment with variations</strong> by adjusting colors, styles, or details</span>
            </li>
          </ul>
        </section>

        {/* Best AI Model - Moved to Bottom (Last) */}
        <section className="mb-6">
          <ModelRatings prompt={prompt} />
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} AItrendpromt • Free, no login required</p>
          <InstagramLink
            location="detail_footer"
            className="inline-flex items-center gap-1.5 mt-3 text-purple-600 hover:text-purple-700 transition-colors text-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow us on Instagram for best results</span>
          </InstagramLink>
          <Link href="/" className="mt-2 inline-block text-blue-600 hover:text-blue-700 transition-colors text-sm">
            ← Back to all trends
          </Link>
        </div>
      </footer>
    </div>
    </>
    );
  } catch (error) {
    console.error('Error rendering prompt page:', error);
    // Return a fallback UI instead of crashing
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load prompt
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but we couldn't load this prompt. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
}
