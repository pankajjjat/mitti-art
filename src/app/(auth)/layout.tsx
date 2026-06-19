import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 pt-24 md:pt-28 pb-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[-0.02em] text-text transition-opacity hover:opacity-80"
          >
            Mitti
          </Link>
          <p className="mt-1 font-sans text-sm text-text-muted">
            Handcrafted Indian Art
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center font-sans text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Mitti Art. All rights reserved.
        </p>
      </div>
    </div>
  );
}
