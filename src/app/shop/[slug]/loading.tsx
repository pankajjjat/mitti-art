export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Skeleton breadcrumb */}
        <div className="mb-8 h-4 w-32 animate-pulse rounded bg-earth-100" />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Skeleton main image */}
          <div className="w-full lg:w-[55%]">
            <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-earth-100" />
            <div className="mt-4 flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-20 animate-pulse rounded-lg bg-earth-100"
                />
              ))}
            </div>
          </div>

          {/* Skeleton product info */}
          <div className="w-full lg:w-[45%]">
            <div className="h-5 w-24 animate-pulse rounded-full bg-earth-100" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-earth-100" />
            <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-earth-100" />
            <div className="mt-4 h-4 w-1/4 animate-pulse rounded bg-earth-100" />
            <div className="mt-6 space-y-3 border-y border-earth-200 py-5">
              <div className="h-4 w-1/2 animate-pulse rounded bg-earth-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-earth-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-earth-100" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-5 w-20 animate-pulse rounded bg-earth-100" />
              <div className="h-4 w-full animate-pulse rounded bg-earth-100" />
              <div className="h-4 w-full animate-pulse rounded bg-earth-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-earth-100" />
            </div>
            <div className="mt-8 h-12 w-full animate-pulse rounded-full bg-earth-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
