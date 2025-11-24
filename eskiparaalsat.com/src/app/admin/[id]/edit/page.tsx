// src/app/admin/[id]/edit/page.tsx
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";

const ADMIN_COOKIE_NAME = "admin_session";

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

async function updateBanknote(id: number, formData: FormData) {
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

  const existing = await prisma.banknote.findUnique({
    where: { id },
    select: { imageUrl: true },
  });
  const existingUrls = getImageUrls(existing?.imageUrl ?? null);

  const files = formData.getAll("images");
  const hasNewFiles = files.some(
    (f) => f && typeof f !== "string" && (f as File).size > 0
  );

  let finalImageUrls: string[] | null = null;

  if (hasNewFiles) {
    const uploaded = await uploadImagesToCloudinary(files);
    finalImageUrls = [...existingUrls, ...uploaded];
  }

  await prisma.banknote.update({
    where: { id },
    data: {
      category,
      title,
      nominal: "Belirtilmemiş",
      description: description || null,
      price,
      ...(finalImageUrls ? { imageUrl: JSON.stringify(finalImageUrls) } : {}),
    },
  });

  redirect("/admin");
}

async function deleteBanknote(id: number) {
  "use server";

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (!isAdmin) {
    redirect("/admin/login");
  }

  await prisma.banknote.delete({
    where: { id },
  });

  redirect("/admin");
}

export default async function EditBanknotePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await props.params;

  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const item = await prisma.banknote.findUnique({
    where: { id },
  });

  if (!item) notFound();

  const existingImages = getImageUrls(item.imageUrl);

  async function updateAction(formData: FormData) {
    "use server";
    await updateBanknote(id, formData);
  }

  async function deleteAction() {
    "use server";
    await deleteBanknote(id);
  }

  return (
    <section className="mt-4 flex flex-col items-center sm:items-stretch">
      <div className="w-full max-w-xl mx-auto space-y-4">
        <header className="flex flex-col gap-1 items-center text-center sm:items-start sm:text-left">
          <h1 className="text-xl font-semibold text-zinc-50">
            Para Düzenle
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            ID: {item.id} numaralı kaydı güncelleyebilir veya silebilirsiniz.
          </p>
        </header>

        <div className="space-y-4 rounded-2xl border border-zinc-900 bg-black/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
          {/* Mevcut fotoğraflar */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-zinc-400 text-center sm:text-left">
                Mevcut fotoğraflar
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {existingImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="h-20 w-20 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950"
                  >
                    <img
                      src={url}
                      alt={`Fotoğraf ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 text-center sm:text-left">
                Yeni fotoğraflar yüklerseniz mevcut fotoğrafların üstüne
                eklenir.
              </p>
            </div>
          )}

          {/* Güncelleme formu */}
          <form action={updateAction} className="space-y-4">
            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200">
                Kategori
              </label>
              <select
                name="category"
                defaultValue={item.category}
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
                defaultValue={item.description ?? ""}
                className="min-h-[100px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                defaultValue={item.price}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Yeni fotoğraflar */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200">
                Yeni fotoğraflar (isteğe bağlı)
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="block w-full text-xs text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-emerald-500"
              />
              <p className="text-[11px] text-zinc-500 text-center sm:text-left">
                Yeni fotoğraf seçmezseniz mevcut fotoğraflar aynı kalır.
                Seçerseniz mevcutların üstüne eklenir.
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 pt-2">
              <Link
                href="/admin"
                className="rounded-full border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                Geri dön
              </Link>
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-500"
              >
                Kaydet
              </button>
            </div>
          </form>

          {/* Silme */}
          <form action={deleteAction} className="pt-1 flex justify-center sm:justify-end">
            <button
              type="submit"
              className="rounded-full border border-red-500/80 px-3 py-2 text-[12px] font-medium text-red-300 hover:bg-red-500/10"
            >
              Bu parayı sil
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
