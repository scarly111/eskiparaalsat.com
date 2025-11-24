// src/app/cumhuriyet/page.tsx
import { prisma } from "@/lib/db";
import { BanknoteCard } from "@/components/BanknoteCard";

export default async function CumhuriyetPage() {
  const items = await prisma.banknote.findMany({
    where: { category: "CUMHURIYET" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Cumhuriyet Dönemi Paraları
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Türkiye Cumhuriyeti dönemine ait kağıt paralar. Koleksiyon
          ve yatırım amaçlı ürünler, <span className="text-emerald-400 font-bold">WhatsApp</span>{" "} üzerinden detaylı bilgi ve satış
          imkanıyla listelenmektedir.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-sm text-slate-500 border border-dashed border-slate-700 rounded-xl px-4 py-6 text-center">
          Şu anda Cumhuriyet kategorisinde listelenen bir para bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <BanknoteCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
