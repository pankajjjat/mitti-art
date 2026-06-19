"use client";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terra-100">
            <span className="text-2xl">🖼️</span>
          </div>
          <h2 className="mt-6 font-serif text-2xl text-text">
            Couldn&apos;t load the shop
          </h2>
          <p className="mt-2 font-sans text-sm text-text-muted">
            {error.message || "Something went wrong while fetching products. Please try again."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white transition-all duration-200 hover:bg-terra-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
