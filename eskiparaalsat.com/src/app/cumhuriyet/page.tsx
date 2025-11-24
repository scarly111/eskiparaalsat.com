// src/app/cumhuriyet/page.tsx
import { prisma } from "@/lib/db";
import { BanknoteCard } from "@/components/BanknoteCard";

export const dynamic = "force-dynamic";

export default async function CumhuriyetPage() {
  const items = await prisma.banknote.findMany({
    where: { category: "CUMHURIYET" },
    orderBy: { id: "desc" },
  });

  return (
    <section className="space-y-4 sm:space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
          Cumhuriyet Paraları
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-prose">
          Cumhuriyet dönemi kağıt paralar, koleksiyon ve yatırım amaçlı
          gösterim listesi.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Şu anda listelenen Cumhuriyet parası bulunmuyor.
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BanknoteCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
