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
    <div className="mt-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4 text-slate-50">
        Yeni Para Ekle
      </h1>

      <form
        action={createBanknote}
        className="space-y-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md shadow-black/40"
      >
        {/* Kategori */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">
            Kategori
          </label>
          <select
            name="category"
            className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="CUMHURIYET">Cumhuriyet</option>
            <option value="OSMANLI">Osmanlı</option>
          </select>
        </div>

        {/* Açıklama */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">
            Açıklama
          </label>
          <textarea
            name="description"
            className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
            placeholder="Parayı tarif edin; yıl, nominal değer, kondisyon gibi bilgileri buraya yazabilirsiniz."
          />
        </div>

        {/* Fiyat */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">
            Fiyat (TL)"
          </label>
          <input
            name="price"
            type="number"
            className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
            placeholder="Örn: 12500"
            required
          />
        </div>

        {/* Fotoğraflar */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">
            Fotoğraflar
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            className="block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
          />
          <p className="text-[11px] text-slate-500">
            Birden fazla fotoğraf seçebilirsiniz. Telefonda galeriden,
            bilgisayarda klasörden seçerek yükleyin.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/admin"
            className="px-3 py-2 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
          >
            İptal
          </Link>
          <button
            type="submit"
            className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-medium"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
