'use client'

export default function EventsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Skeleton */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Tier Upgrade Skeleton */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-12 border border-white/20">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Events Section Skeleton */}
        <div className="mb-12">
          <div className="h-8 w-56 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Image skeleton */}
                <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                
                {/* Content skeleton */}
                <div className="p-6">
                  {/* Tier badge skeleton */}
                  <div className="h-6 w-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                  
                  {/* Title skeleton */}
                  <div className="h-6 w-full bg-gray-200 rounded mb-3 animate-pulse"></div>
                  
                  {/* Description skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Date skeleton */}
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
          background-size: 200px;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
