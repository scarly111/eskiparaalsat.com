// src/components/BanknoteCard.tsx
import { Banknote } from "@prisma/client";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

type BanknoteCardProps = {
  item: Banknote;
};

function humanCategory(category: string) {
  return category === "CUMHURIYET" ? "Cumhuriyet" : "Osmanlı";
}

// DB'deki JSON string'den görsel URL listesi çıkar
function getImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    // Eski data tek URL string ise:
    if (typeof raw === "string" && raw.startsWith("http")) {
      return [raw];
    }
  }
  return [];
}

export function BanknoteCard({ item }: BanknoteCardProps) {
  const images = getImageUrls(item.imageUrl);
  const cover = images[0];

  const message =
    `Merhaba, sitenizdeki şu parayla ilgileniyorum:\n\n` +
    `Kategori: ${humanCategory(item.category)}\n` +
    `Başlık: ${item.title}\n` +
    `Fiyat: ${item.price.toLocaleString("tr-TR")} TL\n` +
    `ID: ${item.id}\n\nBilgi alabilir miyim?`;

  const waLink = buildWhatsAppLink(message);

  return (
    <div className="bg-slate-900/80 rounded-2xl shadow-md shadow-black/40 border border-slate-800 overflow-hidden flex flex-col hover:border-emerald-500/70 hover:shadow-emerald-900/30 transition">
      {/* DİKKAT: her zaman ID ile detay sayfasına gidiyoruz */}
      <Link href={`/p/${item.id}`} className="block">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            className="w-full h-44 object-cover bg-slate-900"
          />
        ) : (
          <div className="w-full h-44 bg-slate-900 flex items-center justify-center text-xs text-slate-500">
            Fotoğraf bulunmuyor
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link href={`/p/${item.id}`} className="block">
          <div>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-emerald-300">
              {item.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {humanCategory(item.category)}
            </p>
          </div>
        </Link>

        <div className="mt-1 text-sm font-semibold text-emerald-400">
          {item.price.toLocaleString("tr-TR")} TL
        </div>

        <div className="mt-auto flex justify-end pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border border-emerald-500/70 text-emerald-300 hover:bg-emerald-500/10"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
