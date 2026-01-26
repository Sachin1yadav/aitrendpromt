export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm animate-pulse"
        >
          <div className="w-full bg-gray-200" style={{ aspectRatio: "4/3" }}>
            <div className="grid grid-cols-2 gap-0.5 h-full">
              <div className="bg-gray-300"></div>
              <div className="bg-gray-300"></div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

