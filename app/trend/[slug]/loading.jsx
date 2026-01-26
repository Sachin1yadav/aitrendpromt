export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-200 rounded" style={{ aspectRatio: '9/16' }}></div>
                <div className="bg-gray-200 rounded" style={{ aspectRatio: '9/16' }}></div>
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="bg-gray-200 rounded p-4 h-96"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

