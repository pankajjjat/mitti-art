"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Paintbrush, Sparkles, Truck } from "lucide-react";
import clsx from "clsx";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    icon: Search,
    title: "Inspiration",
    description:
      "Finding stories in Indian traditions &mdash; from folk tales to architectural motifs, every piece begins with a narrative waiting to be told.",
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

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visible = useOnScreen(sectionRef);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Process"
          title="The Creative Journey"
          subtitle="From inspiration to your doorstep — every piece is made with intention, patience, and care."
        />

        {/* Timeline / Steps */}
        <div
          className={clsx(
            "relative mt-16 md:mt-20",
            "transition-all duration-700",
            visible ? "animate-fade-up" : "opacity-0 translate-y-5"
          )}
        >
          {/* Horizontal connector line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-earth-300 md:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={clsx(
                  "relative flex flex-col items-center text-center",
                  "transition-all duration-500",
                  visible && "animate-fade-up"
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Step Circle with Number */}
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-earth-300 bg-surface shadow-sm">
                  <step.icon
                    size={28}
                    className="text-accent"
                    aria-hidden="true"
                  />
                  {/* Step number badge */}
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-[0.625rem] font-semibold text-white shadow-sm">
                    {i + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-6 font-serif text-xl leading-snug text-text">
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-3 font-sans text-sm leading-[1.7] text-text-muted md:text-base"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
