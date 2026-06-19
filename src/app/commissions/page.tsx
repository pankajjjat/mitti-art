import type { Metadata } from "next";
import CommissionForm from "@/components/CommissionForm";

export const metadata: Metadata = {
  title: "Custom Art Commissions",
  description:
    "Commission a custom artwork from Mitti Art. Madhubani paintings, resin art, ceramics, and more — tailored to your vision. Handcrafted in India.",
  openGraph: {
    title: "Custom Art Commissions — Mitti Art",
    description:
      "Have a vision? We'll bring it to life. Commission custom handcrafted Indian art.",
    type: "website",
  },
};

const commissionExamples = [
  {
    title: "Custom Madhubani Wedding Scene",
    medium: "Madhubani Painting on Canvas",
    size: '36" × 48"',
    description:
      "A bride and groom depicted in traditional Madhubani style, surrounded by auspicious symbols and floral motifs. Commissioned as a wedding gift.",
  },
  {
    title: "Personalized Resin River Table",
    medium: "Resin Art with Botanicals",
    size: '48" × 24"',
    description:
      "A custom resin river table incorporating dried flowers from the client's wedding bouquet, preserved in crystal-clear epoxy.",
  },
  {
    title: "Custom Ceramic Ganesha Set",
    medium: "Hand-painted Ceramic",
    size: "Set of 5 | Various sizes",
    description:
      "A family set of hand-thrown ceramic Ganesha idols, each personalized with the family members' favorite colors and motifs.",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Share Your Vision",
    description:
      "Fill out the form below with as much detail as possible — size, colors, style, subject matter, and any reference images.",
  },
  {
    step: 2,
    title: "Consultation & Quote",
    description:
      "I'll review your request and get back to you within 24-48 hours to discuss the concept, materials, timeline, and provide a quote.",
  },
  {
    step: 3,
    title: "Creation Process",
    description:
      "Once approved, I'll begin crafting your piece. I'll share progress photos and keep you updated throughout the journey.",
  },
  {
    step: 4,
    title: "Delivery & Celebration",
    description:
      "Your finished artwork is carefully packaged and shipped to your doorstep, ready to bring joy to your space.",
  },
];

export default function CommissionsPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-terra-900/30" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 50%, rgba(196, 64, 0, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(212, 160, 74, 0.2) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="container-page relative z-10 text-center">
          <p className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.08em] text-white/60">
            Commission &bull; Create &bull; Collect
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-[-0.02em] text-white md:text-5xl lg:text-6xl">
            Custom Art Commissions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Have a vision? Tell me what you&apos;re looking for and I&apos;ll
            bring it to life — a custom painting, ceramic set, resin piece, or
            anything in between. Every commission is a collaboration.
          </p>
        </div>
      </section>

      {/* ─── PROCESS EXPLANATION ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              How It Works
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-text md:text-[2.5rem]">
              From Idea to Artwork
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-muted">
              Commissioning a piece is a collaborative journey. Here&apos;s how
              we&apos;ll work together to create something meaningful.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2 md:gap-10">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="relative flex gap-5 rounded-xl border border-earth-200 bg-surface p-6 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-sm font-semibold text-white">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAST EXAMPLES ─── */}
      <section className="bg-earth-50/50 py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              Past Commissions
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-text md:text-[2.5rem]">
              Examples of Custom Work
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-muted">
              Every commission is unique. Here are a few examples of what
              we&apos;ve created for collectors around the world.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {commissionExamples.map((example) => (
              <div
                key={example.title}
                className="rounded-xl border border-earth-200 bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center rounded-lg bg-earth-100">
                  <span className="font-serif text-4xl text-earth-400">✦</span>
                </div>
                <h3 className="mt-4 font-serif text-base font-semibold text-text">
                  {example.title}
                </h3>
                <p className="mt-1 font-sans text-xs text-text-muted">
                  {example.medium} &middot; {example.size}
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMISSION FORM ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              Get Started
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-text md:text-[2.5rem]">
              Submit Your Commission Request
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-muted">
              Fill out the form below and I&apos;ll get back to you within 24-48
              hours to discuss your project.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <CommissionForm compact />
          </div>
        </div>
      </section>
    </div>
  );
}
