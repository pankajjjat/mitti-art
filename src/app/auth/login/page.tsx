"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }

      setIsLoading(true);
      try {
        const success = await login(email, password);
        if (success) {
          router.push("/account");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, router]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 md:pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 font-sans text-sm text-text-muted">
            Sign in to your Mitti Art account
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
          {/* Error toast */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-error/10 px-4 py-3">
              <span className="font-sans text-sm text-error">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="block h-11 w-full rounded-lg border border-earth-300 bg-page pl-4 pr-11 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-earth-300 accent-accent"
                />
                <span className="font-sans text-xs text-text-muted">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="font-sans text-xs text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Signup link */}
        <p className="mt-6 text-center font-sans text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
