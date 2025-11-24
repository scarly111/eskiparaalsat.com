// src/components/BanknoteCard.tsx
import Link from "next/link";
import type { Banknote } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function getImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    if (typeof raw === "string" && raw.startsWith("http")) {
      return [raw];
    }
  }
  return [];
}

function humanCategory(category: string) {
  return category === "CUMHURIYET" ? "Cumhuriyet" : "Osmanlı";
}

type BanknoteCardProps = { item: Banknote };

export function BanknoteCard({ item }: BanknoteCardProps) {
  const imageUrls = getImageUrls(item.imageUrl);
  const cover = imageUrls[0];

  // Karttan WhatsApp'a giden mesaj
  const message =
    `Merhaba, sitenizdeki şu parayla ilgileniyorum:\n\n` +
    `Kategori: ${humanCategory(item.category)}\n` +
    `Başlık: ${item.title}\n` +
    `Fiyat: ${item.price.toLocaleString("tr-TR")} TL\n` +
    `ID: ${item.id}\n\nBilgi alabilir miyim?`;

  const waLink = buildWhatsAppLink(message);

  return (
    <div className="group rounded-2xl border border-zinc-900 bg-black/70 shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-700">
      {/* Üst taraf: Detay sayfasına götüren alan */}
      <Link href={`/p/${item.id}`} className="block">
        {/* Görsel */}
        <div className="relative overflow-hidden rounded-t-2xl border-b border-zinc-900 bg-zinc-950">
          <div className="aspect-[16/10] w-full">
            {cover ? (
              <img
                src={cover}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(250,250,250,0.08),_transparent_55%)] text-[11px] text-zinc-500">
                Fotoğraf eklenmedi
              </div>
            )}
          </div>
        </div>

        {/* Başlık + kategori */}
        <div className="space-y-2 px-3.5 pt-3.5 pb-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-medium text-zinc-50">
              {item.title}
            </h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {humanCategory(item.category)}
            </p>
          </div>
        </div>
      </Link>

      {/* Alt taraf: Fiyat + WhatsApp linki */}
      <div className="flex items-end justify-between px-3.5 pb-3.5 pt-1">
        {/* Fiyat */}
        <div className="flex flex-col">
          <span className="text-[11px] text-zinc-500">Fiyat</span>
          <span className="text-sm font-semibold text-emerald-400">
            {item.price.toLocaleString("tr-TR")} TL
          </span>
        </div>

        {/* WhatsApp pill — ikon + border + link */}
        <div className="self-end translate-y-[1px]">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-1.5
              rounded-full
              border border-emerald-500/40
              bg-emerald-500/10
              px-2.5 py-[5px]
              text-[10px]
              font-medium
              text-emerald-300
              transition
              group-hover:border-emerald-400
              group-hover:bg-emerald-500/20
              group-hover:text-emerald-200
            "
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
