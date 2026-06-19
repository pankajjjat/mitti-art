import { getTestimonials } from "@/lib/pocketbase";
import type { Metadata } from "next";
import TestimonialsPageClient from "./TestimonialsPageClient";

export const metadata: Metadata = {
  title: "Testimonials — Mitti Art",
  description:
    "Hear from our collectors and customers about their experience with Mitti Art's handcrafted Indian artworks.",
  openGraph: {
    title: "Testimonials — Mitti Art",
    description: "What our collectors say about Mitti Art.",
    type: "website",
  },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-12 md:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl tracking-[-0.02em] text-text md:text-5xl lg:text-6xl">
            What Our Collectors Say
          </h1>
          <p className="mt-4 font-sans text-base text-text-muted md:text-lg">
            Real stories from art lovers who have welcomed Mitti into their
            homes and hearts.
          </p>
        </div>

        {/* Client component for interactive filtering/featured highlights */}
        <TestimonialsPageClient testimonials={testimonials} />
      </div>
    </div>
  );
}
