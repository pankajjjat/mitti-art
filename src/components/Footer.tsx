import Link from "next/link";
import {
  Camera,
  MessageCircle,
  ImageIcon,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import { categories } from "@/lib/products";

const quickLinks = [
  { label: "Explore", href: "#explore" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/saumya.chaurasia04",
    icon: Camera,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/100077641696027",
    icon: MessageCircle,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/mittiart",
    icon: ImageIcon,
  },
  {
    label: "Email",
    href: "mailto:hello@mittiart.com",
    icon: Mail,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918770858280",
    icon: Phone,
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-page py-16 md:py-20">
        {/* Top Row — Brand + Social */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-white no-underline"
            >
              Mitti
            </Link>
            <p className="mt-1.5 font-sans text-sm text-white/60">
              Handcrafted Indian Art
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white"
                aria-label={social.label}
              >
                <social.icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-white/10" />

        {/* Middle Row — Links */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Categories
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`#explore`}
                    className="font-sans text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
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
                  <span aria-hidden="true" className="inline-block w-3.5" />
                  India
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-white/10" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-sans text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mitti. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-sans text-xs text-white/40">
            Handcrafted with love in India
            <Heart size={12} className="text-accent/70" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
