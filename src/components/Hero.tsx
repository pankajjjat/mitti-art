"use client";

import { ChevronDown } from "lucide-react";
import Marquee from "@/components/Marquee";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Full-bleed Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay with vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center md:px-6">
        <p className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.08em] text-white/70 md:text-[0.8125rem]">
          Handcrafted in India &bull; Samuya &bull; मिट्टी
        </p>

        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white md:text-7xl lg:text-[5rem]">
          Art Born from the Earth
        </h1>

        <p className="mt-6 max-w-xl font-sans text-lg leading-[1.7] text-white/80 md:text-xl">
          Madhubani paintings, resin art &amp; ceramics from ₹3,500
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
          <Button variant="primary" size="lg" href="#explore">
            Explore the Collection
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="#about"
            className="border-white/20 text-white hover:border-gold-500 hover:text-gold-500"
          >
            Meet the Artist
          </Button>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10">
        <Marquee className="border-t border-white/10" />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 hidden flex-col items-center gap-2 md:flex">
        <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-white/50">
          Scroll
        </span>
        <ChevronDown
          size={16}
          className="animate-bounce text-white/40"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
