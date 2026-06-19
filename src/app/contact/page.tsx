import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact — Mitti Art",
  description:
    "Get in touch with Mitti Art. Reach out for inquiries, commissions, or just to say hello.",
  openGraph: {
    title: "Contact — Mitti Art",
    description: "Get in touch with Mitti Art.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-12 md:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl tracking-[-0.02em] text-text md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-4 font-sans text-base text-text-muted md:text-lg">
            We&apos;d love to hear from you. Whether it&apos;s a commission
            inquiry, a question about an artwork, or just to say namaste.
          </p>
        </div>

        <ContactPageClient />
      </div>
    </div>
  );
}
