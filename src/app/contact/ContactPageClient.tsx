"use client";

import { useState, useCallback } from "react";
import {
  Mail,
  Globe,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "+919876543210"; // Replace with actual number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Mitti%20Art!`;
const EMAIL = "hello@mittiart.com";
const INSTAGRAM_USERNAME = "saumya.chaurasia04";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USERNAME}`;

const businessHours = [
  { day: "Monday – Friday", hours: "10:00 AM – 7:00 PM IST" },
  { day: "Saturday", hours: "10:00 AM – 5:00 PM IST" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [formErrors]
  );

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);

      // Simulate sending email (in production, would call API)
      await new Promise((r) => setTimeout(r, 1200));

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    [formData, validate]
  );

  return (
    <div className="mt-14 md:mt-16">
      <div className="grid gap-10 lg:grid-cols-5">
        {/* ─── Contact Form ─── */}
        <div className="lg:col-span-3">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50/50 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-text">
                Message Sent!
              </h3>
              <p className="mt-2 font-sans text-sm text-text-muted">
                Thank you for reaching out! We&apos;ll get back to you within
                24–48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8"
            >
              <h2 className="font-serif text-lg text-text">
                Send us a Message
              </h2>

              <div className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your full name"
                    className={cn(
                      "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                      formErrors.name
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-earth-300 focus:border-accent focus:ring-accent"
                    )}
                  />
                  {formErrors.name && (
                    <p className="mt-1 font-sans text-xs text-error">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className={cn(
                      "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                      formErrors.email
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-earth-300 focus:border-accent focus:ring-accent"
                    )}
                  />
                  {formErrors.email && (
                    <p className="mt-1 font-sans text-xs text-error">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    placeholder="How can we help?"
                    className={cn(
                      "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                      formErrors.subject
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-earth-300 focus:border-accent focus:ring-accent"
                    )}
                  />
                  {formErrors.subject && (
                    <p className="mt-1 font-sans text-xs text-error">
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className={cn(
                      "mt-1.5 block w-full rounded-lg border bg-page px-4 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                      formErrors.message
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-earth-300 focus:border-accent focus:ring-accent"
                    )}
                  />
                  {formErrors.message && (
                    <p className="mt-1 font-sans text-xs text-error">
                      {formErrors.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ─── Contact Info ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email */}
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Mail size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Email
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-sans text-sm font-medium text-text underline underline-offset-4 transition-colors hover:text-accent"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MessageCircle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  WhatsApp
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm font-medium text-text underline underline-offset-4 transition-colors hover:text-green-600"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <Globe size={18} className="text-pink-600" />
              </div>
              <div>
                <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Instagram
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm font-medium text-text underline underline-offset-4 transition-colors hover:text-pink-600"
                >
                  @{INSTAGRAM_USERNAME}
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Business Hours
                </p>
                <div className="mt-2 space-y-1">
                  {businessHours.map((b) => (
                    <div
                      key={b.day}
                      className="flex justify-between gap-4 font-sans text-sm"
                    >
                      <span className="text-text-muted">{b.day}</span>
                      <span className="text-text">{b.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Address Placeholder */}
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-earth-100">
                <MapPin size={18} className="text-earth-600" />
              </div>
              <div>
                <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Location
                </p>
                <p className="mt-1 font-sans text-sm text-text">
                  Mitti Art Studio
                </p>
                <p className="font-sans text-sm text-text-muted">
                  Mumbai, Maharashtra, India
                </p>
                {/* Simple map placeholder */}
                <div className="mt-3 aspect-[16/9] rounded-lg border border-earth-200 bg-earth-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={24} className="mx-auto text-earth-400" />
                    <p className="mt-1 font-sans text-[0.625rem] text-text-muted">
                      Mumbai, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:scale-110 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
