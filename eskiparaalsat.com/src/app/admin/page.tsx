// src/app/admin/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Banknote } from "@prisma/client";

const ADMIN_COOKIE_NAME = "admin_session";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const items: Banknote[] = await prisma.banknote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Admin Paneli
          </h1>
          <p className="text-xs text-slate-400">
            Buradan yeni para ekleyebilir, mevcut kayıtları düzenleyebilir veya
            silebilirsiniz.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Yeni Para Ekle
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3 py-2 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-slate-500 border border-dashed border-slate-700 rounded-xl px-4 py-6 text-center">
          Henüz sisteme para eklenmemiş. Yukarıdan{" "}
          <span className="font-semibold text-slate-200">
            Yeni Para Ekle
          </span>{" "}
          butonunu kullanarak ilk ürünü ekleyebilirsiniz.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/70">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900 text-[11px] text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">ID</th>
                <th className="px-3 py-2 text-left font-medium">Başlık</th>
                <th className="px-3 py-2 text-left font-medium">Kategori</th>
                <th className="px-3 py-2 text-right font-medium">Fiyat (TL)</th>
                <th className="px-3 py-2 text-center font-medium">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: Banknote) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-800 hover:bg-slate-900/80"
                >
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {item.id}
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate text-slate-100">
                    {item.title}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-300">
                    {item.category === "CUMHURIYET"
                      ? "Cumhuriyet"
                      : "Osmanlı"}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-100">
                    {item.price.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Link
                      href={`/admin/${item.id}/edit`}
                      className="text-[11px] text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
