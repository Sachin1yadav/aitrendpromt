import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import ModelRatings from "@/components/ModelRatings";
import ExampleImagesGallery from "@/components/ExampleImagesGallery";
import ImagesToUseGallery from "@/components/ImagesToUseGallery";
import DownloadImageButton from "@/components/DownloadImageButton";
import { getPromptBySlug, getAllSlugs } from "@/lib/api";

export const dynamic = 'force-dynamic'; // Changed to dynamic for API fetching
export const revalidate = 60; // Revalidate every 60 seconds

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            ← Back to Trends
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">{prompt.title}</h1>
        <p className="mb-10 text-xl text-gray-600">{prompt.description}</p>

        {/* Before & After - Moved to top for better UX */}
        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Before & After</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group relative">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DownloadImageButton 
                  imageUrl={prompt.beforeImage || "/placeholder.jpg"} 
                  filename={`${prompt.slug}-before.jpg`}
                  variant="overlay"
                  size="md"
                />
              </div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Before</div>
                <div className="opacity-100 group-hover:opacity-0 transition-opacity">
                  <DownloadImageButton 
                    imageUrl={prompt.beforeImage || "/placeholder.jpg"} 
                    filename={`${prompt.slug}-before.jpg`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-gray-300 shadow-lg group-hover:border-blue-400 transition-colors" style={{ aspectRatio: '9/16' }}>
                <Image
                  src={prompt.beforeImage || "/placeholder.jpg"}
                  alt={`${prompt.title} - Before`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  unoptimized={prompt.beforeImage?.includes('cloudinary.com')}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </div>
            <div className="group relative">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DownloadImageButton 
                  imageUrl={prompt.afterImage || "/placeholder.jpg"} 
                  filename={`${prompt.slug}-after.jpg`}
                  variant="overlay"
                  size="md"
                />
              </div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">After</div>
                <div className="opacity-100 group-hover:opacity-0 transition-opacity">
                  <DownloadImageButton 
                    imageUrl={prompt.afterImage || "/placeholder.jpg"} 
                    filename={`${prompt.slug}-after.jpg`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-green-400 shadow-lg group-hover:border-green-500 transition-colors" style={{ aspectRatio: '9/16' }}>
                <Image
                  src={prompt.afterImage || "/placeholder.jpg"}
                  alt={`${prompt.title} - After`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  unoptimized={prompt.afterImage?.includes('cloudinary.com')}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Images You Should Use */}
        {prompt.imgshoulduse && prompt.imgshoulduse.length > 0 && (
          <ImagesToUseGallery 
            images={prompt.imgshoulduse} 
            title="Images You Should Use"
          />
        )}

        {/* Example Input Images */}
        {prompt.exampleImages && prompt.exampleImages.length > 0 && (
          <ExampleImagesGallery 
            images={prompt.exampleImages} 
            title="Example Output Images"
          />
        )}

        <section className="mb-10">
          <ModelRatings prompt={prompt} />
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-bold text-gray-900">Prompt</h2>
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 font-mono leading-relaxed">
              {prompt.prompt}
            </pre>
          </div>
          <div className="mt-6">
            <CopyButton text={prompt.prompt} className="w-full sm:w-auto" />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-900">How to Use This Trend</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold">1.</span>
              <span><strong>Reference the example images</strong> above to understand the style and composition</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold">2.</span>
              <span><strong>Copy the prompt</strong> exactly as shown for best results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold">3.</span>
              <span><strong>Use the recommended AI model</strong> ({prompt.bestModel}) for optimal output</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold">4.</span>
              <span><strong>Upload similar images</strong> to your AI tool that match the example style</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5 font-bold">5.</span>
              <span><strong>Experiment with variations</strong> by adjusting colors, styles, or details</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} AItrendpromt • Free, no login required</p>
          <Link href="/" className="mt-3 inline-block text-blue-600 hover:text-blue-700 transition-colors font-medium">
            ← Back to all trends
          </Link>
        </div>
      </footer>
    </div>
  );
}

