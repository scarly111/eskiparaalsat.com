// src/app/osmanli/page.tsx
import { prisma } from "@/lib/db";
import { BanknoteCard } from "@/components/BanknoteCard";

export const dynamic = "force-dynamic";

export default async function OsmanliPage() {
  const items = await prisma.banknote.findMany({
    where: { category: "OSMANLI" },
    orderBy: { id: "desc" },
  });

  return (
    <section className="space-y-4 sm:space-y-5 flex flex-col items-center sm:items-stretch">
      <header className="flex flex-col gap-1 items-center text-center sm:items-start sm:text-left">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
          Osmanlı Paraları
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-prose">
          Osmanlı dönemine ait kağıt paralar, koleksiyon amaçlı olarak
          sergilenmektedir.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center sm:text-left">
          Şu anda listelenen Osmanlı parası bulunmuyor.
        </p>
      ) : (
        <div className="w-full max-w-xl sm:max-w-none mx-auto">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <BanknoteCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
