// Reusable skeleton blocks for Next.js `loading.js` files.
// These render inside the route segment only (Navbar/Footer/sidebar live in
// their own layouts and stay mounted), so navigation never blanks the page.

export function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <div className="h-12 bg-gray-200 rounded-xl w-3/4 mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-8 animate-pulse" />
        <div className="flex flex-wrap gap-4">
          <div className="h-14 bg-gray-200 rounded-full w-40 animate-pulse" />
          <div className="h-14 bg-gray-200 rounded-full w-48 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 animate-pulse" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServiceListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-200 rounded-xl w-1/2 mx-auto mb-4 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="h-14 bg-gray-200 rounded-xl w-2/3 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="h-7 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <div className="h-10 bg-gray-200 rounded-xl w-1/3 mx-auto mb-4 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {['All', 'Web', 'Mobile', 'E-commerce', 'Design'].map((item) => (
          <div key={item} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="h-56 bg-gray-200 animate-pulse" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse" />
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="h-4 bg-gray-200 rounded-full w-16 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-full w-20 animate-pulse" />
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="h-10 bg-gray-200 rounded-xl w-1/3 mx-auto animate-pulse" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-full mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse" />
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="h-4 bg-gray-200 rounded-lg w-24 mb-6 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded-xl w-full mb-3 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded-xl w-2/3 mb-6 animate-pulse" />
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse" />
      </div>
      <div className="h-72 bg-gray-200 rounded-xl w-full mb-8 animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function DefaultSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="h-14 bg-gray-200 rounded-xl w-2/3 mx-auto mb-6 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 bg-slate-200 rounded-lg w-1/3 mb-2 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded-lg w-1/2 mb-6 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-slate-200 mb-4 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded-lg w-1/2 mb-2 animate-pulse" />
            <div className="h-7 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="h-6 bg-slate-200 rounded-lg w-1/4 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-10 bg-slate-100 rounded-lg w-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
