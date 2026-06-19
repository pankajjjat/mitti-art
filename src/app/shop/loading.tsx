export default function ShopLoading() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-12">
        {/* Skeleton search bar */}
        <div className="mb-8 h-12 w-full animate-pulse rounded-lg bg-earth-100" />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Skeleton sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-earth-100" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-32 animate-pulse rounded bg-earth-100"
                  />
                ))}
              </div>
              <div className="h-6 w-20 animate-pulse rounded bg-earth-100" />
              <div className="h-8 w-full animate-pulse rounded bg-earth-100" />
            </div>
          </aside>

          {/* Skeleton grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-5 w-40 animate-pulse rounded bg-earth-100" />
              <div className="h-9 w-44 animate-pulse rounded bg-earth-100" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg bg-surface">
                  <div className="aspect-[3/4] animate-pulse bg-earth-100" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-earth-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-earth-100" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-earth-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
