// src/app/admin/new/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";

const ADMIN_COOKIE_NAME = "admin_session";

async function uploadImagesToCloudinary(
  files: (File | string)[]
): Promise<string[]> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary ayarları eksik. .env içinde CLOUDINARY_CLOUD_NAME ve CLOUDINARY_UPLOAD_PRESET tanımlı olmalı."
    );
  }

  const urls: string[] = [];

  for (const f of files) {
    if (!f || typeof f === "string") continue;
    if (f.size === 0) continue;

    const formData = new FormData();
    formData.append("file", f);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = (await res.json()) as any;

    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      throw new Error("Fotoğraf yüklenirken bir hata oluştu.");
    }

    if (data.secure_url) {
      urls.push(data.secure_url as string);
    }
  }

  return urls;
}

async function createBanknote(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const category = formData.get("category")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const priceStr = formData.get("price")?.toString() ?? "0";
  const price = Number(priceStr);

  const titleBase = description.trim();
  const title =
    titleBase.length > 0 ? titleBase.slice(0, 80) : "Açıklamasız para";

  const files = formData.getAll("images");
  const imageUrls = await uploadImagesToCloudinary(files);

  await prisma.banknote.create({
    data: {
      category,
      title,
      nominal: "Belirtilmemiş",
      description: description || null,
      price,
      imageUrl:
        imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
    },
  });

  redirect("/admin");
}

export default async function NewBanknotePage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <section className="mt-4 flex flex-col items-center sm:items-stretch">
      <div className="w-full max-w-xl mx-auto space-y-4">
        <header className="flex flex-col gap-2 items-center text-center sm:items-start sm:text-left">
          <h1 className="text-xl font-semibold text-zinc-50">
            Yeni Para Ekle
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kategori, açıklama, fiyat ve fotoğrafları ekleyerek yeni bir
            kayıt oluşturun.
          </p>
        </header>

        <form
          action={createBanknote}
          className="space-y-4 rounded-2xl border border-zinc-900 bg-black/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.7)]"
        >
          {/* Kategori */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200">
              Kategori
            </label>
            <select
              name="category"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="CUMHURIYET">Cumhuriyet</option>
              <option value="OSMANLI">Osmanlı</option>
            </select>
          </div>

          {/* Açıklama */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200">
              Açıklama
            </label>
            <textarea
              name="description"
              className="min-h-[100px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Bu parayla ilgili açıklama..."
            />
          </div>

          {/* Fiyat */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200">
              Fiyat (TL)
            </label>
            <input
              name="price"
              type="number"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Örn: 12500"
              required
            />
          </div>

          {/* Fotoğraflar */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200">
              Fotoğraflar
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="block w-full text-xs text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-emerald-500"
            />
            <p className="text-[11px] text-zinc-500">
              Birden fazla fotoğraf seçebilirsiniz. Telefonda galeriden,
              bilgisayarda klasörden seçerek yükleyin.
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2 pt-2">
            <Link
              href="/admin"
              className="rounded-full border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              İptal
            </Link>
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-500"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
