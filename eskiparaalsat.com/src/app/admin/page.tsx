// src/app/admin/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ADMIN_COOKIE_NAME = "admin_session";

function humanCategory(category: string) {
  return category === "CUMHURIYET" ? "Cumhuriyet" : "Osmanlı";
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const items = await prisma.banknote.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <section className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-stretch">
      <header className="flex flex-col gap-2 items-center text-center sm:items-start sm:text-left">
        <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          Yönetim Paneli
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
          Paralar
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-prose">
          Buradan koleksiyona yeni para ekleyebilir, var olanları
          düzenleyebilir veya silebilirsiniz.
        </p>
        <div className="pt-1">
          <Link
            href="/admin/new"
            className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-white"
          >
            Yeni Para Ekle
          </Link>
        </div>
      </header>

      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            Henüz kayıtlı para bulunmuyor. Yukarıdaki butondan yeni para
            ekleyebilirsiniz.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-zinc-900 bg-black/60 px-3.5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 hidden sm:block text-[11px] text-zinc-500">
                    #{item.id}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium text-zinc-50">
                        {item.title}
                      </span>
                      <span className="rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                        {humanCategory(item.category)}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.price.toLocaleString("tr-TR")} TL
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 sm:justify-end">
                  <Link
                    href={`/p/${item.id}`}
                    className="text-[11px] text-zinc-400 hover:text-zinc-100 hover:underline"
                  >
                    Detayı görüntüle
                  </Link>
                  <Link
                    href={`/admin/${item.id}/edit`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-[12px] font-medium text-zinc-100 hover:bg-zinc-800"
                  >
                    Düzenle
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
