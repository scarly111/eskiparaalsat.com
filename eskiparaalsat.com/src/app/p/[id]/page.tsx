// src/app/p/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";
import { ImageCarousel } from "@/components/ImageCarousel";

export const dynamic = "force-dynamic";

function humanCategory(category: string) {
  return category === "CUMHURIYET" ? "Cumhuriyet" : "Osmanlı";
}

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

export default async function BanknoteDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await props.params;

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    notFound();
  }

  const item = await prisma.banknote.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  const imageUrls = getImageUrls(item.imageUrl);

  const message =
    `Merhaba, sitenizdeki şu parayla ilgileniyorum:\n\n` +
    `Kategori: ${humanCategory(item.category)}\n` +
    `Başlık: ${item.title}\n` +
    `Fiyat: ${item.price.toLocaleString("tr-TR")} TL\n` +
    `ID: ${item.id}\n\nBilgi alabilir miyim?`;

  const waLink = buildWhatsAppLink(message);

  return (
    <section className="space-y-4 sm:space-y-5">
      <Link
        href={item.category === "CUMHURIYET" ? "/cumhuriyet" : "/osmanli"}
        className="text-[11px] text-zinc-500 hover:text-zinc-200 hover:underline"
      >
        ← {humanCategory(item.category)} paralarına dön
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-black/60 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        {/* Slider */}
        {imageUrls.length > 0 && (
          <ImageCarousel images={imageUrls} altBase={item.title} />
        )}

        <div className="space-y-4 p-4 sm:p-5">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-semibold text-zinc-50 tracking-tight">
              {item.title}
            </h1>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {humanCategory(item.category)} · ID #{item.id}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] text-zinc-500">Fiyat</div>
              <div className="text-lg font-semibold text-emerald-400">
                {item.price.toLocaleString("tr-TR")} TL
              </div>
            </div>

            <div className="pt-1 sm:pt-0">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-black shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
              >
                WhatsApp ile iletişime geç
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
