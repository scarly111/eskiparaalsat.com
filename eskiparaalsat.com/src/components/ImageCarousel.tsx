// src/components/ImageCarousel.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageCarouselProps = {
  images: string[];
  altBase: string;
};

export function ImageCarousel({ images, altBase }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="relative border-b border-zinc-900 bg-black">
      <div className="w-full aspect-[16/10] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="flex h-full w-full flex-shrink-0 items-center justify-center bg-zinc-950"
            >
              <img
                src={url}
                alt={`${altBase} - Fotoğraf ${i + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sol/sağ oklar */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 shadow-lg shadow-black/60 hover:bg-zinc-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 shadow-lg shadow-black/60 hover:bg-zinc-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dot indicatorlar */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-emerald-400"
                    : "w-2 bg-zinc-600 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
