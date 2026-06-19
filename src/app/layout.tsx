import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Analytics from "@/components/Analytics";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mitti — Handcrafted Indian Art",
    template: "%s — Mitti Art",
  },
  description:
    "Discover handcrafted Indian art by Samuya. Canvas paintings, mandala art, Madhubani paintings, resin art, ceramics and more. Each piece is 100% handcrafted with love in India.",
  keywords: [
    "Indian art",
    "handcrafted",
    "Madhubani painting",
    "resin art",
    "Indian folk art",
    "Mitti",
    "Samuya Chaurasia",
    "home decor",
    "Indian handicrafts",
    "canvas art",
    "mandala art",
    "Pichwai",
    "Warli art",
  ],
  authors: [{ name: "Samuya Chaurasia" }],
  creator: "Samuya Chaurasia",
  publisher: "Mitti Art",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://mittiart.com"),
  openGraph: {
    title: "Mitti — Handcrafted Indian Art",
    description:
      "Discover handcrafted Indian art by Samuya. Each piece is 100% handcrafted with love in India.",
    type: "website",
    locale: "en_IN",
    siteName: "Mitti Art",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mitti — Handcrafted Indian Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitti — Handcrafted Indian Art",
    description:
      "Discover handcrafted Indian art by Samuya. Each piece is 100% handcrafted with love in India.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-page font-sans text-text antialiased">
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#2c1810",
              color: "#f5f0eb",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#2d8a4e",
                secondary: "#f5f0eb",
              },
            },
            error: {
              iconTheme: {
                primary: "#c94b4b",
                secondary: "#f5f0eb",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
