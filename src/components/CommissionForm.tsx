"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Palette, Send, CheckCircle, Upload } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const artTypes = ["Painting", "Ceramic", "Mixed Media", "Other"] as const;

const budgetRanges = [
  "Under ₹5,000",
  "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "Above ₹50,000",
] as const;

const timelines = [
  "Within 1 week",
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "Flexible / No rush",
] as const;

interface FormData {
  name: string;
  email: string;
  phone: string;
  artType: string;
  description: string;
  budget: string;
  timeline: string;
  size: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  description?: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  artType: "",
  description: "",
  budget: "",
  timeline: "",
  size: "",
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Please enter your name";
  }

  if (!data.email.trim()) {
    errors.email = "Please enter your email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.description.trim()) {
    errors.description = "Please describe what you're looking for";
  }

  return errors;
}

type CommissionFormProps = {
  /** If true, renders only the form (no section wrapper). Used on the dedicated /commissions page. */
  compact?: boolean;
};

export default function CommissionForm({ compact = false }: CommissionFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const subject = encodeURIComponent(
      `Commission Request from ${form.name}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nArt Type: ${form.artType}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nSize: ${form.size}\n\nDescription:\n${form.description}`
    );
    window.open(`mailto:hello@mittiart.com?subject=${subject}&body=${body}`);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h2 className="mt-6 font-serif text-2xl leading-snug text-text md:text-3xl">
          Request Sent!
        </h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-text-muted">
          Thank you, {form.name}! We&apos;ve opened your email client with
          the details. Send the email and we&apos;ll get back to you within
          24-48 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setSubmitted(false);
            setFileName(null);
          }}
          className="mt-8 font-sans text-sm font-medium text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name + Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block font-sans text-sm font-medium text-text"
          >
            Name <span className="text-error">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 font-sans text-xs text-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-sans text-sm font-medium text-text"
          >
            Email <span className="text-error">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 font-sans text-xs text-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block font-sans text-sm font-medium text-text"
        >
          Phone <span className="text-text-muted/50">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="+91 98765 43210"
        />
      </div>

      {/* Art Type + Size row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="artType"
            className="block font-sans text-sm font-medium text-text"
          >
            Artwork Type
          </label>
          <div className="relative mt-1.5">
            <select
              id="artType"
              name="artType"
              value={form.artType}
              onChange={handleChange}
              className="block w-full appearance-none rounded-lg border border-earth-300 bg-page px-4 py-3 pr-10 font-sans text-sm text-text transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select type...</option>
              {artTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Palette
                size={16}
                className="text-text-muted"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="size"
            className="block font-sans text-sm font-medium text-text"
          >
            Desired Size <span className="text-text-muted/50">(optional)</span>
          </label>
          <input
            id="size"
            name="size"
            type="text"
            value={form.size}
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder='e.g. 24" × 36"'
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block font-sans text-sm font-medium text-text"
        >
          Description <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
          placeholder="Tell us about your vision — size, colors, style, subject matter, and any reference images or ideas you'd like to share..."
        />
        {errors.description && (
          <p className="mt-1 font-sans text-xs text-error">
            {errors.description}
          </p>
        )}
      </div>

      {/* Budget + Timeline row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget"
            className="block font-sans text-sm font-medium text-text"
          >
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select range...</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="timeline"
            className="block font-sans text-sm font-medium text-text"
          >
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select timeline...</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reference image upload (UI only) */}
      <div>
        <label className="block font-sans text-sm font-medium text-text">
          Reference Image{" "}
          <span className="text-text-muted/50">(optional)</span>
        </label>
        <div className="mt-1.5 flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text-muted transition-colors hover:border-accent hover:text-accent">
            <Upload size={16} />
            <span>{fileName || "Upload image..."}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </label>
          {fileName && (
            <button
              type="button"
              onClick={() => setFileName(null)}
              className="font-sans text-xs text-text-muted underline underline-offset-2 hover:text-error"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 font-sans text-xs text-text-muted/60">
          Upload a reference image (max 5MB). We&apos;ll review it as part of
          your request.
        </p>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Send size={16} />
          Send Request
        </button>
      </div>
    </form>
  );

  if (compact) {
    return formContent;
  }

  return (
    <section id="contact" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Commission"
          title="Request Custom Art"
          subtitle="Have a specific vision? Tell us what you're looking for and we'll bring it to life."
        />

        <div className="mx-auto mt-12 max-w-2xl">{formContent}</div>
      </div>
    </section>
  );
}
