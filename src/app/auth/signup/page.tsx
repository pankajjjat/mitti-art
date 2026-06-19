"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const signup = useAppStore((s) => s.signup);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, phone, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsLoading(true);
      try {
        const success = await signup(name, email, password, confirmPassword);
        if (success) {
          router.push("/account");
        } else {
          setErrors({
            email:
              "Signup failed. This email may already be registered. Please try logging in.",
          });
        }
      } catch {
        setErrors({
          form: "Something went wrong. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [name, email, password, confirmPassword, signup, router, validate]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 md:pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            Create Account
          </h1>
          <p className="mt-2 font-sans text-sm text-text-muted">
            Join the Mitti Art community
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
          {/* Form error */}
          {errors.form && (
            <div className="mb-6 rounded-lg bg-error/10 px-4 py-3">
              <span className="font-sans text-sm text-error">
                {errors.form}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Your full name"
                autoComplete="name"
                className={cn(
                  "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                  errors.name
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-earth-300 focus:border-accent focus:ring-accent"
                )}
              />
              {errors.name && (
                <p className="mt-1 font-sans text-xs text-error">{errors.name}</p>
              )}
            </div>

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                  errors.email
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-earth-300 focus:border-accent focus:ring-accent"
                )}
              />
              {errors.email && (
                <p className="mt-1 font-sans text-xs text-error">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
              >
                Phone Number <span className="text-text-muted/50">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className={cn(
                  "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                  errors.phone
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-earth-300 focus:border-accent focus:ring-accent"
                )}
              />
              {errors.phone && (
                <p className="mt-1 font-sans text-xs text-error">
                  {errors.phone}
                </p>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={cn(
                    "block h-11 w-full rounded-lg border bg-page pl-4 pr-11 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                    errors.password
                      ? "border-error focus:border-error focus:ring-error"
                      : "border-earth-300 focus:border-accent focus:ring-accent"
                  )}
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
              {errors.password && (
                <p className="mt-1 font-sans text-xs text-error">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                }}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={cn(
                  "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                  errors.confirmPassword
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-earth-300 focus:border-accent focus:ring-accent"
                )}
              />
              {errors.confirmPassword && (
                <p className="mt-1 font-sans text-xs text-error">
                  {errors.confirmPassword}
                </p>
              )}
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center font-sans text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
