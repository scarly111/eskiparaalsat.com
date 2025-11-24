// src/app/admin/login/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "parola123";

async function loginAction(formData: FormData) {
  "use server";

  const password = formData.get("password")?.toString() ?? "";

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage(props: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const searchParams = (await props.searchParams) || {};
  const hasError = searchParams.error === "1";

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-900 bg-black/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-400 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)]">
            ₺
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-50">
              Yönetici Girişi
            </h1>
            <p className="text-[11px] text-zinc-400">
              Bu alan yalnızca site sahibine özeldir.
            </p>
          </div>
        </div>

        <form action={loginAction} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-200">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Yönetici şifresi"
              required
            />
          </div>

          {hasError && (
            <p className="text-[11px] text-red-400">
              Şifre hatalı. Tekrar deneyin.
            </p>
          )}

          <div className="pt-1 flex justify-center">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-500"
            >
              Giriş yap
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
