import Link from "next/link";
import {
  Camera,
  MessageCircle,
  ImageIcon,
  Mail,
  Phone,
  Heart,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

const categories = [
  { label: "Canvas Art", href: "/shop?category=Canvas+Art" },
  { label: "Mandala Art", href: "/shop?category=Mandala+Art" },
  { label: "Religious Art", href: "/shop?category=Religious+Art" },
  { label: "Floral Art", href: "/shop?category=Floral+Art" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact", icon: Mail },
  { label: "FAQ", href: "/contact", icon: HelpCircle },
  { label: "Shipping Info", href: "/contact", icon: Truck },
  { label: "Returns & Exchanges", href: "/contact", icon: RotateCcw },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/saumya.chaurasia04",
    icon: Camera,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/mittiart",
    icon: ImageIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918770858280",
    icon: Phone,
  },
  {
    label: "Email",
    href: "mailto:hello@mittiart.com",
    icon: Mail,
  },
];

const paymentMethods = [
  { name: "UPI", icon: "/icons/upi.svg" },
  { name: "Visa", icon: "/icons/visa.svg" },
  { name: "Mastercard", icon: "/icons/mastercard.svg" },
  { name: "PayPal", icon: "/icons/paypal.svg" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-page py-16 md:py-20">
        {/* Top Row — 4 Columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-white no-underline"
            >
              Mitti
            </Link>
            <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-white/60">
              Handcrafted Indian art rooted in tradition. Each piece is a
              conversation between ancient techniques and contemporary
              aesthetics — made with patience, purpose, and love.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Shop
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="font-sans text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Support
            </h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 font-sans text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <link.icon size={14} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Newsletter */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Connect
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="mailto:hello@mittiart.com"
                  className="flex items-center gap-2 font-sans text-sm text-white/60 transition-colors hover:text-white"
                >
                  <Mail size={14} aria-hidden="true" />
                  hello@mittiart.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918770858280"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-white/60 transition-colors hover:text-white"
                >
                  <Phone size={14} aria-hidden="true" />
                  +91 87708 58280
                </a>
              </li>
              <li>
                <p className="flex items-center gap-2 font-sans text-sm text-white/60">
                  <MapPin size={14} aria-hidden="true" />
                  India
                </p>
              </li>
            </ul>

            {/* Newsletter CTA */}
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.06em] text-white/80">
                Stay inspired
              </p>
              <p className="mt-1 font-sans text-xs text-white/50">
                Get updates on new collections and studio stories.
              </p>
              <Link
                href="/#newsletter"
                className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-accent transition-colors hover:text-terra-400"
              >
                Join the Mitti Circle &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-white/10" />

        {/* Payment Methods */}
        <div className="mb-8">
          <p className="mb-3 text-center font-sans text-xs font-medium uppercase tracking-[0.08em] text-white/40">
            Accepted Payments
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex h-8 items-center rounded border border-white/10 bg-white/5 px-3 font-sans text-[0.625rem] font-medium uppercase tracking-[0.06em] text-white/40"
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-sans text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mitti Art by Samuya. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="font-sans text-xs text-white/40 transition-colors hover:text-white/60"
            >
              Contact Us
            </Link>
            <Link
              href="/contact"
              className="font-sans text-xs text-white/40 transition-colors hover:text-white/60"
            >
              Shipping Policy
            </Link>
          </div>

          <p className="flex items-center gap-1.5 font-sans text-xs text-white/50">
            <span className="flex items-center gap-1">
              Handmade in India
              <Heart size={11} className="text-accent/70" aria-hidden="true" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
