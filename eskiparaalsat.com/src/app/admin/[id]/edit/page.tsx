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

  // Mevcut fotoğrafları DB'den çekiyoruz ki üstüne ekleyebilelim
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
    // ESKİ + YENİ = BİRLEŞTİR
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
      // yeni foto varsa birleşmiş listeyi yaz, yoksa imageUrl'e dokunma
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
    <div className="mt-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4 text-slate-50">
        Para Düzenle (ID: {item.id})
      </h1>

      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md shadow-black/40 space-y-4">
        {/* Mevcut fotoğraflar */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Mevcut fotoğraflar</div>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950"
                >
                  <img
                    src={url}
                    alt={`Fotoğraf ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Yeni fotoğraflar yüklerseniz mevcut fotoğrafların ÜSTÜNE eklenir.
            </p>
          </div>
        )}

        {/* GÜNCELLEME FORMU */}
        <form action={updateAction} className="space-y-4">
          {/* Kategori */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Kategori
            </label>
            <select
              name="category"
              className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              defaultValue={item.category}
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
              defaultValue={item.description ?? ""}
              className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
            />
          </div>

          {/* Fiyat */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Fiyat (TL)
            </label>
            <input
              name="price"
              type="number"
              defaultValue={item.price}
              className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
              required
            />
          </div>

          {/* Yeni fotoğraflar */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Yeni fotoğraflar (isteğe bağlı)
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              Yeni fotoğraf seçmezseniz mevcut fotoğraflar aynı kalır. Seçerseniz,
              mevcut fotoğrafların üstüne eklenir.
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

        {/* SİLME FORMU */}
        <form action={deleteAction} className="pt-1">
          <button
            type="submit"
            className="px-3 py-2 text-xs rounded-lg border border-red-500/80 text-red-300 hover:bg-red-500/10"
          >
            Bu Parayı Sil
          </button>
        </form>
      </div>
    </div>
  );
}
