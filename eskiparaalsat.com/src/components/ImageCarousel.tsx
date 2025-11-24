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
    <div className="relative border-b border-slate-800 bg-slate-950">
      <div className="w-full aspect-[16/10] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 flex items-center justify-center bg-slate-950"
            >
              <img
                src={url}
                alt={`${altBase} - Fotoğraf ${i + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sol ok */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Sağ ok */}
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Alt nokta göstergeleri */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-emerald-400"
                    : "w-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
