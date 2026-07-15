"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

// TODO(CONTENT_TODOS.md): no verified WhatsApp business number exists yet.
// Render nothing rather than link to a fabricated number — restore once a
// real number is supplied.
const WHATSAPP_NUMBER: string | null = null;

export function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null;

  const message = encodeURIComponent(
    "Hi Poddar Pipes, I'd like to know more about your products."
  );

  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
    >
      <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
    </motion.a>
  );
}
