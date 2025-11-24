// src/app/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { BanknoteCard } from "@/components/BanknoteCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await prisma.banknote.findMany({
    orderBy: { id: "desc" },
    take: 6,
  });

  const hasLatest = latest.length > 0;

  return (
    <section className="space-y-6 sm:space-y-8 flex flex-col items-center sm:items-stretch">
      {/* Hero */}
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3 sm:gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1 text-[11px] text-zinc-400 shadow-sm shadow-black/40">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Cumhuriyet & Osmanlı paraları</span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-50">
            Eski Türk Paraları,{" "}
            <span className="text-zinc-300">tek bir vitrinde.</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-prose">
            Cumhuriyet ve Osmanlı dönemine ait kağıt paraları inceleyin,
            beğendiğiniz parçalar için doğrudan <span className="text-emerald-400 font-bold">WhatsApp</span> üzerinden iletişime
            geçin.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <Link
            href="/cumhuriyet"
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-white"
          >
            Cumhuriyet Paraları
          </Link>
          <Link
            href="/osmanli"
            className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Osmanlı Paraları
          </Link>
        </div>
      </div>

      {/* Son eklenenler */}
      <div className="w-full max-w-xl sm:max-w-none mx-auto space-y-3 sm:space-y-4">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-1">
          <h2 className="text-sm sm:text-base font-medium text-zinc-100">
            Son eklenen paralar
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500">
            En son eklenen koleksiyon parçalarına hızlı bir bakış.
          </p>
        </div>

        {hasLatest ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <BanknoteCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            Henüz listelenmiş bir para bulunmuyor.
          </p>
        )}
      </div>
    </section>
  );
}
