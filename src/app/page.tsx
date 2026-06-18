"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/lib/products";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import About from "@/components/About";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import CommissionForm from "@/components/CommissionForm";
import Newsletter from "@/components/Newsletter";
import Marquee from "@/components/Marquee";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <>
      {/* ─── HERO ─── */}
      <Hero />

      {/* ─── MARQUEE ─── */}
      <div className="relative z-10 -mt-6">
        <Marquee />
      </div>

      {/* ─── EXPLORE COLLECTION ─── */}
      <section id="explore" className="py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Collection"
            title="Explore the Collection"
            subtitle="Each piece is a conversation between ancient techniques and contemporary aesthetics — handcrafted with patience, purpose, and love."
            className="mb-12 md:mb-16"
          />
          <ProductGrid onSelect={handleSelect} />
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about">
        <About />
      </section>

      {/* ─── PROCESS ─── */}
      <section id="process" className="py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="How It's Made"
            title="The Creative Journey"
            subtitle="Every Mitti artwork begins as an idea and travels through four stages before it finds its home."
            className="mb-16 md:mb-20"
          />
          <Process />
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kind Words"
            title="What Collectors Say"
            subtitle="From art lovers and collectors who have welcomed Mitti into their spaces."
            className="mb-12 md:mb-16"
          />
          <Testimonials />
        </div>
      </section>

      {/* ─── COMMISSION ─── */}
      <section id="contact" className="py-24 md:py-32 bg-earth-100/50">
        <div className="container-page">
          <CommissionForm />
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <Newsletter />

      {/* ─── PRODUCT MODAL ─── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleClose} />
      )}
    </>
  );
}
