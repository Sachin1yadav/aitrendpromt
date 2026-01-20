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
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
    >
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
        <div className="grid grid-cols-2 gap-1 h-full">
          <div className="relative overflow-hidden rounded-l-xl">
            <div className="absolute top-2 left-2 z-10 rounded-md bg-gray-900/70 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
              Before
            </div>
            <Image
              src={beforeImage}
              alt={`${prompt.title} - Before`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16.5vw"
              loading="lazy"
            />
          </div>
          <div className="relative overflow-hidden rounded-r-xl">
            <div className="absolute top-2 right-2 z-10 rounded-md bg-green-600/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
              After
            </div>
            <Image
              src={afterImage}
              alt={`${prompt.title} - After`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16.5vw"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
        {prompt.title}
      </h3>
      <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">{prompt.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <ModelBadge model={prompt.bestModel} rating="best" size="sm" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{prompt.category}</span>
      </div>
    </Link>
  );
}
