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
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400"
    >
      {/* Image Container - Centered */}
      <div className="relative mb-4 w-full flex justify-center">
        <div className="grid grid-cols-2 gap-2" style={{ width: 'min(410px, 100%)', height: '350px' }}>
          <div className="relative overflow-hidden rounded-xl shadow-md">
            <div className="absolute top-2 left-2 z-10 rounded-md bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
              Before
            </div>
            <Image
              src={beforeImage}
              alt={`${prompt.title} - Before`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="200px"
              loading="lazy"
              unoptimized={beforeImage?.includes('cloudinary.com')}
            />
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-md">
            <div className="absolute top-2 right-2 z-10 rounded-md bg-green-600/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
              After
            </div>
            <Image
              src={afterImage}
              alt={`${prompt.title} - After`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="200px"
              loading="lazy"
              unoptimized={afterImage?.includes('cloudinary.com')}
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {prompt.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">{prompt.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <ModelBadge model={prompt.bestModel} rating="best" size="sm" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{prompt.category}</span>
        </div>
      </div>
    </Link>
  );
}
