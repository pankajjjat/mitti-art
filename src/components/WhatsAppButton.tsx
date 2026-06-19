"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "918770858280";
const WHATSAPP_MESSAGE = "Hi Mitti Art! I'd like to know more about your artworks.";

export default function WhatsAppButton() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:bg-[#20BD5A] hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-page animate-fade-in"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" stroke="none" />
    </button>
  );
}
