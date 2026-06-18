"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }

    // Open mailto as a simple subscription placeholder
    const subject = encodeURIComponent("Newsletter Subscription");
    const body = encodeURIComponent(
      `Please subscribe this email to the Mitti Circle newsletter:\n\nEmail: ${email}`
    );
    window.open(`mailto:hello@mittiart.com?subject=${subject}&body=${body}`);

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="bg-primary py-20 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.5rem]">
            Join the Mitti Circle
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-white/70 md:text-lg">
            Be the first to know about new collections, studio updates, and
            exclusive offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail
                  size={16}
                  className="text-white/50"
                  aria-hidden="true"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your email"
                className="block w-full rounded-full border border-white/20 bg-white/10 py-3 pl-11 pr-4 font-sans text-sm text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Email for newsletter"
              />
            </div>

            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Subscribe
            </button>
          </form>

          {status === "success" && (
            <p className="mt-4 font-sans text-sm text-green-300">
              Thank you! We&rsquo;ve opened an email for you to confirm your
              subscription.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 font-sans text-sm text-red-300">
              Please enter a valid email address.
            </p>
          )}

          <p className="mt-5 font-sans text-xs leading-relaxed text-white/40">
            No spam, ever. We respect your inbox and will only send meaningful
            updates. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
