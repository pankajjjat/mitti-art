"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Palette, Sparkles, Compass } from "lucide-react";
import clsx from "clsx";

const stats = [
  { icon: ImageIcon, value: "13", label: "Original Artworks" },
  { icon: Palette, value: "8+", label: "Art Forms" },
  { icon: Sparkles, value: "100%", label: "Handcrafted" },
  { icon: Compass, value: "Pan-India", label: "Inspiration" },
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

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visible = useOnScreen(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-page py-20 md:py-28"
    >
      <div className="container-page">
        {/* Two-column layout */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left — Text */}
          <div
            className={clsx(
              "transition-all duration-700",
              visible ? "animate-fade-up" : "opacity-0 translate-y-5"
            )}
          >
            <h2 className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-text md:text-[3rem] md:leading-[1.1]">
              The Story of Mitti
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-muted md:text-lg">
              Mitti &mdash; the earth that holds us, nurtures us, and inspires us.
            </p>

            <div className="mt-8 space-y-5 font-sans text-base leading-[1.8] text-text/80">
              <p>
                Mitti Art was born from a deep love for India&rsquo;s artistic
                heritage. Founded by <strong className="text-text">Samuya Chaurasia</strong>,
                every piece is a conversation between ancient traditions and
                contemporary expression.
              </p>
              <p>
                From the intricate dotwork of Gond paintings to the rhythmic
                lines of Warli art, from hand-thrown ceramics to luminous resin
                seascapes &mdash; each creation carries the soul of the earth
                and the hands that shaped it.
              </p>
              <p>
                We work directly with skilled artisans across India, preserving
                techniques that have been passed down through generations while
                giving them a modern canvas. Every brushstroke, every carving,
                every pour of resin is a celebration of the beauty that emerges
                when human creativity meets the raw elements of nature.
              </p>
            </div>
          </div>

          {/* Right — Artist Image Placeholder */}
          <div
            className={clsx(
              "relative flex items-center justify-center transition-all duration-700 delay-200",
              visible ? "animate-fade-up" : "opacity-0 translate-y-5"
            )}
          >
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-earth-100 shadow-lg">
              {/* Decorative border frame */}
              <div className="absolute -inset-3 rounded-[1.25rem] border-2 border-earth-300/60" />

              {/* Placeholder content */}
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-earth-200">
                  <ImageIcon
                    size={32}
                    className="text-earth-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-sans text-sm text-text-muted">
                  Artist Portrait
                </p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-earth-400">
                  Samuya Chaurasia
                </p>
              </div>

              {/* Decorative corner accents */}
              <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-accent/40" />
              <span className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-accent/40" />
              <span className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-accent/40" />
              <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-accent/40" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          className={clsx(
            "mt-16 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6",
            "transition-all duration-700 delay-300",
            visible ? "animate-fade-up" : "opacity-0 translate-y-5"
          )}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface px-4 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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
      </div>
    </section>
  );
}
