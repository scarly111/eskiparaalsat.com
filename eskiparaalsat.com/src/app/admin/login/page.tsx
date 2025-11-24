// src/app/admin/login/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "admin_session";

async function loginAction(formData: FormData) {
  "use server";

  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

  const cookieStore = await cookies();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookieStore.set(ADMIN_COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    redirect("/admin");
  }

  redirect("/admin/login");
}

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const alreadyLogged = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (alreadyLogged) {
    redirect("/admin");
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md shadow-black/40">
      <h1 className="text-lg font-semibold mb-4 text-center text-slate-50">
        Admin Girişi
      </h1>

      <form action={loginAction} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">
            Kullanıcı Adı
          </label>
          <input
            name="username"
            className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Şifre</label>
          <input
            name="password"
            type="password"
            className="w-full border border-slate-700 bg-slate-950 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-emerald-600 text-white text-sm py-2.5 rounded-lg hover:bg-emerald-500 font-medium"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
