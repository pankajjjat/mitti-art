"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  Palette,
  Sparkles,
  Award,
  Search,
  Paintbrush,
  Truck,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";

// ─── Stats ───
const stats = [
  { icon: Palette, value: "5+", label: "Years of Experience" },
  { icon: ImageIcon, value: "50+", label: "Artworks Created" },
  { icon: Sparkles, value: "100+", label: "Happy Collectors" },
  { icon: Award, value: "1", label: "National Award" },
];

// ─── Process Steps ───
const processSteps = [
  {
    icon: Search,
    title: "Inspiration",
    description:
      "Finding stories in Indian traditions — from folk tales to architectural motifs, every piece begins with a narrative waiting to be told.",
  },
  {
    icon: Paintbrush,
    title: "Creation",
    description:
      "Handcrafted using traditional techniques passed down through generations. Natural pigments, sustainable materials, and patient hands bring each vision to life.",
  },
  {
    icon: Sparkles,
    title: "Finishing",
    description:
      "Meticulous details & quality checks. Every edge is refined, every stroke evaluated, ensuring the piece meets the highest standards of craftsmanship.",
  },
  {
    icon: Truck,
    title: "Delivery",
    description:
      "Safe packaging & worldwide shipping. Each artwork is carefully packed with archival materials so it arrives at your doorstep exactly as intended.",
  },
];

function useOnScreen(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return visible;
}

export default function AboutPageClient() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const processRef = useRef<HTMLDivElement | null>(null);
  const statsVisible = useOnScreen(statsRef);
  const processVisible = useOnScreen(processRef);

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ─── Hero Section — Artist Intro ─── */}
      <section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left — Artist photo */}
          <div
            className={clsx(
              "transition-all duration-700",
              "opacity-0 translate-y-5"
            )}
            style={{
              animation: "fade-up 0.7s ease-out forwards",
            }}
          >
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-earth-200 bg-earth-100 shadow-lg mx-auto md:mx-0">
              {/* Decorative border */}
              <div className="absolute -inset-3 rounded-[1.25rem] border-2 border-earth-300/60" />

              {/* Placeholder photo */}
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-earth-200">
                  <ImageIcon
                    size={40}
                    className="text-earth-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-sans text-sm text-text-muted">
                  Artist Portrait
                </p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-earth-400">
                  Saumya Chaurasia
                </p>
              </div>

              {/* Corner accents */}
              <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-accent/40" />
              <span className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-accent/40" />
              <span className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-accent/40" />
              <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-accent/40" />
            </div>
          </div>

          {/* Right — Story */}
          <div
            className={clsx(
              "transition-all duration-700 delay-200",
              "opacity-0 translate-y-5"
            )}
            style={{
              animation: "fade-up 0.7s ease-out 0.2s forwards",
            }}
          >
            <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] text-text md:text-5xl lg:text-6xl">
              The Artist Behind Mitti
            </h1>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-muted md:text-lg">
              Saumya Chaurasia — a multidisciplinary artist based in Mumbai,
              India.
            </p>

            <div className="mt-8 space-y-5 font-sans text-base leading-[1.8] text-text/80">
              <p>
                Mitti Art was born from a deep love for India&rsquo;s artistic
                heritage. Every piece is a conversation between ancient
                traditions and contemporary expression — a dialogue between the
                earth and the hands that shape it.
              </p>
              <p>
                From the intricate dotwork of Madhubani paintings to the
                luminous depths of resin art, from hand-thrown ceramics to
                delicate botanical watercolors — each creation carries the soul
                of the earth and the hands that shaped it.
              </p>
              <p>
                Saumya works directly with skilled artisans across India,
                preserving techniques that have been passed down through
                generations while giving them a modern canvas. Every
                brushstroke, every carving, every pour of resin is a celebration
                of the beauty that emerges when human creativity meets the raw
                elements of nature.
              </p>
              <p>
                The name &ldquo;Mitti&rdquo; means earth — the soil that holds
                us, nurtures us, and inspires us. It&rsquo;s a reminder that
                all art, at its core, is a return to our roots.
              </p>
            </div>

            {/* Social proof / signature */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-earth-300" />
              <span className="font-serif text-sm italic text-text-muted">
                — Saumya Chaurasia
              </span>
              <div className="h-px flex-1 bg-earth-300" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section ref={statsRef}>
        <div
          className={clsx(
            "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
            "transition-all duration-700",
            statsVisible ? "animate-fade-up" : "opacity-0 translate-y-5"
          )}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-3 rounded-xl border border-earth-200 bg-surface px-4 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20">
                <stat.icon
                  size={20}
                  className="text-accent"
                  aria-hidden="true"
                />
              </div>
              <span className="font-serif text-2xl leading-none tracking-tight text-text md:text-3xl">
                {stat.value}
              </span>
              <span className="font-sans text-xs font-medium uppercase tracking-[0.06em] text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Process ─── */}
      <section ref={processRef}>
        <div className="text-center">
          <h2 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            The Creative Process
          </h2>
          <p className="mt-3 font-sans text-base text-text-muted max-w-xl mx-auto">
            From inspiration to your doorstep — every piece is made with
            intention, patience, and care.
          </p>
        </div>

        <div
          className={clsx(
            "relative mt-14 md:mt-16",
            "transition-all duration-700",
            processVisible ? "animate-fade-up" : "opacity-0 translate-y-5"
          )}
        >
          {/* Connector line on desktop */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-earth-300 md:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                {/* Circle */}
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-earth-300 bg-surface shadow-sm">
                  <step.icon
                    size={28}
                    className="text-accent"
                    aria-hidden="true"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-[0.625rem] font-semibold text-white shadow-sm">
                    {i + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-xl leading-snug text-text">
                  {step.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-[1.7] text-text-muted md:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="rounded-2xl bg-accent/5 border border-accent/20 p-8 md:p-12 text-center">
        <h2 className="font-serif text-3xl text-text md:text-4xl">
          Want to Own a Piece of Mitti?
        </h2>
        <p className="mt-4 font-sans text-base text-text-muted max-w-lg mx-auto">
          Explore the collection or commission a custom artwork that speaks
          to your soul.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-sans text-[0.875rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
          >
            Browse Collection
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-earth-300 px-8 py-4 font-sans text-[0.875rem] font-medium uppercase tracking-[0.04em] text-text transition-all duration-200 hover:border-accent hover:text-accent"
          >
            Request a Commission
          </Link>
        </div>
      </section>
    </div>
  );
}
