"use client";

import { useState, useCallback, useEffect } from "react";
import type { Product } from "@/lib/products";
import type { MittiProduct } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import CategoryCard from "@/components/CategoryCard";
import About from "@/components/About";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import CommissionForm from "@/components/CommissionForm";
import Newsletter from "@/components/Newsletter";
import { products as fallbackProducts } from "@/lib/products";

const categoriesData = [
  {
    name: "Canvas Art",
    slug: "canvas-art",
    image: "/images/shanti-padma.jpg",
    count: 4,
    description: "Original acrylic and mixed media on canvas",
  },
  {
    name: "Mandala Art",
    slug: "mandala-art",
    image: "/images/surya-om-mandala.jpg",
    count: 3,
    description: "Intricate hand-painted mandala designs",
  },
  {
    name: "Religious Art",
    slug: "religious-art",
    image: "/images/ekadanta.jpg",
    count: 3,
    description: "Sacred iconography and spiritual art",
  },
  {
    name: "Resin Art",
    slug: "resin-art",
    image: "/images/prakriti.jpg",
    count: 3,
    description: "Nature preserved in crystal-clear resin",
  },
];

// Map PB product to the Product type the UI expects
function toLegacyProduct(pb: MittiProduct): Product {
  return {
    id: pb.id,
    name: pb.title,
    hindiName: "",
    slug: pb.slug,
    image: pb.images?.[0] || "",
    category: pb.category,
    medium: pb.materials || "",
    price: pb.sale_price ?? pb.price,
    description: pb.description,
    story: "",
    dimensions: pb.dimensions || "",
    featured: pb.featured,
    sold: !pb.stock,
    year: new Date().getFullYear(),
    inStock: pb.stock,
  };
}

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null);

  // Fetch live data from Supabase; fall back to static on failure
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .order("created", { ascending: false });
        const mapped = (data || []).map((r: any) => toLegacyProduct(r));
        setLiveProducts(mapped);
      } catch {
        // DB offline — keep null, fall through to fallbackProducts
      }
    })();
  }, []);

  const products = liveProducts ?? fallbackProducts;
  const featuredProducts = products.filter((p) => p.featured);

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

      {/* ─── FEATURED PRODUCTS ─── */}
      <section id="featured" className="py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured"
            title="Featured Artworks"
            subtitle="Curated pieces that represent the best of Mitti's craftsmanship and creativity."
            className="mb-12 md:mb-16"
          />
          <ProductGrid
            products={featuredProducts}
            onSelect={handleSelect}
          />
        </div>
      </section>

      {/* ─── CATEGORIES SHOWCASE ─── */}
      <section className="py-24 md:py-32 bg-earth-50/50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Categories"
            title="Browse by Category"
            subtitle="Explore our diverse range of art forms — each with its own story, technique, and soul."
            className="mb-12 md:mb-16"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesData.map((cat) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                image={cat.image}
                count={cat.count}
                description={cat.description}
              />
            ))}
          </div>
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
      <CommissionForm />

      {/* ─── NEWSLETTER ─── */}
      <section id="newsletter">
        <Newsletter />
      </section>

      {/* ─── PRODUCT MODAL ─── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleClose} />
      )}
    </>
  );
}
