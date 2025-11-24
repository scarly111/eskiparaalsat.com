// src/lib/whatsapp.ts
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE;

if (!WHATSAPP_PHONE) {
  console.warn("WHATSAPP_PHONE env değişkeni tanımlı değil.");
}

export function buildWhatsAppLink(message: string) {
  const phone = WHATSAPP_PHONE ?? "";
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}
