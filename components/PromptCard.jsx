import Link from "next/link";
import Image from "next/image";
import ModelBadge from "./ModelBadge";

export default function PromptCard({ prompt }) {
  const beforeImage = prompt.beforeImage || prompt.images?.[0] || "/placeholder.jpg";
  const afterImage = prompt.afterImage || prompt.images?.[1] || prompt.images?.[0] || "/placeholder.jpg";
  
  return (
    <Link
      href={`/trend/${prompt.slug}`}
      prefetch={true}
      scroll={false}
      className="group block rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400"
    >
      {/* Image Container - Wider, less tall */}
      <div className="relative w-full bg-gray-100">
        <div className="grid grid-cols-2 gap-0.5" style={{ aspectRatio: '4/3' }}>
          <div className="relative overflow-hidden bg-gray-200">
            <div className="absolute top-1.5 left-1.5 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
              Before
            </div>
            <Image
              src={beforeImage}
              alt={`${prompt.title} - Before`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
              unoptimized={beforeImage?.includes('cloudinary.com')}
            />
          </div>
          <div className="relative overflow-hidden bg-gray-200">
            <div className="absolute top-1.5 right-1.5 z-10 rounded bg-green-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
              After
            </div>
            <Image
              src={afterImage}
              alt={`${prompt.title} - After`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
              unoptimized={afterImage?.includes('cloudinary.com')}
            />
          </div>
        </div>
      </div>
      
      {/* Content - Compact */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {prompt.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 leading-snug min-h-[2rem]">{prompt.description}</p>
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
          <ModelBadge model={prompt.bestModel} rating="best" size="sm" />
          <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">{prompt.category}</span>
        </div>
      </div>
    </Link>
  );
}
