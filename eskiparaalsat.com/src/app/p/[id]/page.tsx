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
    <div className="space-y-4">
      <Link
        href={item.category === "CUMHURIYET" ? "/cumhuriyet" : "/osmanli"}
        className="text-[11px] text-slate-400 hover:text-emerald-300 hover:underline"
      >
        ← {humanCategory(item.category)} paralarına dön
      </Link>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md shadow-black/40">
        {imageUrls.length > 0 && (
          <ImageCarousel images={imageUrls} altBase={item.title} />
        )}

        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-50">
              {item.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {humanCategory(item.category)}
            </p>
          </div>

          <div>
            <div className="text-[11px] text-slate-500">Fiyat</div>
            <div className="font-semibold text-emerald-400 text-lg">
              {item.price.toLocaleString("tr-TR")} TL
            </div>
          </div>

          <div className="pt-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            >
              WhatsApp ile iletişime geç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
