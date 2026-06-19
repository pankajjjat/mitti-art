import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — Mitti Art",
  description:
    "Meet Saumya Chaurasia, the artist behind Mitti Art. Discover the story of Mitti — handcrafted Indian art rooted in tradition and made with love.",
  openGraph: {
    title: "About — Mitti Art",
    description:
      "Meet Saumya Chaurasia, the artist behind Mitti Art.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-12 md:py-16">
        <AboutPageClient />
      </div>
    </div>
  );
}
