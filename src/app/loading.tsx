export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page">
      {/* Animated Logo */}
      <div className="relative">
        <div className="h-20 w-20 animate-pulse">
          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-accent/30 bg-accent/5">
            <span className="font-serif text-3xl text-accent animate-pulse">
              M
            </span>
          </div>
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-0 h-20 w-20 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>

      <p className="mt-6 font-serif text-lg text-text-muted animate-pulse">
        Loading...
      </p>
      <p className="mt-2 font-sans text-xs text-text-muted/60">
        Handcrafted with care
      </p>
    </div>
  );
}
