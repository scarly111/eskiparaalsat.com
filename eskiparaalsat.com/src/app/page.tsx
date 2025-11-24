// src/app/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { BanknoteCard } from "@/components/BanknoteCard";

export default async function HomePage() {
  const latest = await prisma.banknote.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
            Eski Para Koleksiyon & Satış
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Cumhuriyet ve Osmanlı dönemine ait kağıt paralar. Satın almak istediğiniz paralar için <span className="text-emerald-400 font-bold">WhatsApp</span>{" "} üzerinden iletişime geçebilirsiniz.
            
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-sm">
            <Link
              href="/cumhuriyet"
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-100"
            >
              Cumhuriyet Paraları
            </Link>
            <Link
              href="/osmanli"
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-100"
            >
              Osmanlı Paraları
            </Link>
          </div>
        </div>

        <div className="mt-3 sm:mt-0 flex flex-col gap-2 text-xs text-slate-400 sm:text-right">
          <div className="inline-flex items-center gap-2 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Satın almak için kartlardaki WhatsApp butonunu kullanın.</span>
          </div>
          <div>Her ürün birebir fotoğraflıdır ve stok adedi sınırlıdır.</div>
        </div>
      </section>

      {/* SON EKLENENLER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Son eklenen paralar
          </h2>
          <div className="text-[11px] text-slate-500">
            Tüm liste için{" "}
            <Link
              href="/cumhuriyet"
              className="underline hover:text-emerald-300"
            >
              Cumhuriyet
            </Link>{" "}
            veya{" "}
            <Link
              href="/osmanli"
              className="underline hover:text-emerald-300"
            >
              Osmanlı
            </Link>{" "}
            sayfalarını ziyaret edin.
          </div>
        </div>

        {latest.length === 0 ? (
          <div className="text-sm text-slate-500 border border-dashed border-slate-700 rounded-xl px-4 py-6 text-center">
            Henüz sisteme para eklenmemiş.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((item) => (
              <BanknoteCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
