import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instagram } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import ModelRatings from "@/components/ModelRatings";
import ExampleImagesGallery from "@/components/ExampleImagesGallery";
import ImagesToUseGallery from "@/components/ImagesToUseGallery";
import DownloadImageButton from "@/components/DownloadImageButton";
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

export default async function PromptDetailPage({ params }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AItrendpromt</h1>
              <p className="mt-0.5 text-xs text-gray-600">Discover viral AI prompts with real examples</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/aitrendpromt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">Follow</span>
              </a>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
          <p className="text-base text-gray-600">{prompt.description}</p>
        </div>

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
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-300 shadow-sm group-hover:border-blue-500 transition-all w-full" style={{ aspectRatio: '9/16' }}>
                    <Image
                      src={prompt.beforeImage || "/placeholder.jpg"}
                      alt={`${prompt.title} - Before`}
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
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border-2 border-green-400 shadow-sm group-hover:border-green-600 transition-all w-full" style={{ aspectRatio: '9/16' }}>
                    <Image
                      src={prompt.afterImage || "/placeholder.jpg"}
                      alt={`${prompt.title} - After`}
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
                <CopyButton text={prompt.prompt} className="w-full sm:w-auto" />
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
            <a
              href="https://www.instagram.com/aitrendpromt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @aitrendpromt</span>
            </a>
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
          <a
            href="https://www.instagram.com/aitrendpromt/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-purple-600 hover:text-purple-700 transition-colors text-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow us on Instagram for best results</span>
          </a>
          <Link href="/" className="mt-2 inline-block text-blue-600 hover:text-blue-700 transition-colors text-sm">
            ← Back to all trends
          </Link>
        </div>
      </footer>
    </div>
  );
}
