import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mitti — Handcrafted Indian Art",
  description:
    "Discover handcrafted Indian art by Samuya. Madhubani paintings, resin art, ceramics, miniature paintings and more. Each piece is 100% handcrafted with love in India.",
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
  ],
  openGraph: {
    title: "Mitti — Handcrafted Indian Art",
    description:
      "Discover handcrafted Indian art by Samuya. Each piece is 100% handcrafted with love in India.",
    type: "website",
    locale: "en_IN",
    siteName: "Mitti Art",
  },
  robots: {
    index: true,
    follow: true,
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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
