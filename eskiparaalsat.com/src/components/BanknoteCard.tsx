// src/components/BanknoteCard.tsx
"use client";

import Link from "next/link";
import type { Banknote } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useState, useRef } from "react";

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
  const images = getImageUrls(item.imageUrl);
  const waMessage =
    `Merhaba, bu parayla ilgileniyorum:\n\n` +
    `Kategori: ${humanCategory(item.category)}\n` +
    `Başlık: ${item.title}\n` +
    `Fiyat: ${item.price.toLocaleString("tr-TR")} TL\n` +
    `ID: ${item.id}`;

  const waLink = buildWhatsAppLink(waMessage);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const scrollToIndex = (i: number) => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.clientWidth;
    carouselRef.current.scrollTo({ left: i * w, behavior: "smooth" });
    setIdx(i);
  };

  const onScroll = () => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.clientWidth;
    const sc = carouselRef.current.scrollLeft;
    const newIndex = Math.round(sc / w);
    if (newIndex !== idx) setIdx(newIndex);
  };

  return (
    <div className="group rounded-2xl border border-zinc-900 bg-black/70 shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-700">
      {/* Fotoğraf carousel — detay sayfasına gitmiyor */}
      <div className="relative overflow-hidden rounded-t-2xl border-b border-zinc-900 bg-zinc-950">
        <div
          ref={carouselRef}
          onScroll={onScroll}
          className="
            flex 
            snap-x snap-mandatory 
            overflow-x-auto 
            scrollbar-none 
            w-full 
            aspect-[16/10]
          "
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-full h-full flex items-center justify-center bg-black"
            >
              <img
                src={url}
                alt={`${item.title} fotoğraf ${i + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Dot göstergeleri */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`
                  h-1.5 
                  rounded-full
                  transition-all
                  ${i === idx ? "w-4 bg-emerald-400" : "w-2 bg-zinc-600"}
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* Orta alan: Detay sayfasına tıklanan yer */}
      <Link href={`/p/${item.id}`}>
        <div className="space-y-1 px-3.5 pt-3.5">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-50">
            {item.title}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {humanCategory(item.category)}
          </p>
        </div>
      </Link>

      {/* Alt alan: Fiyat + WhatsApp */}
      <div className="flex items-end justify-between px-3.5 pb-3.5 pt-1">
        <div>
          <span className="text-[11px] text-zinc-500">Fiyat</span>
          <div className="text-sm font-semibold text-emerald-400">
            {item.price.toLocaleString("tr-TR")} TL
          </div>
        </div>

        {/* WhatsApp butonu */}
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
  );
}
