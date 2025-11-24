// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Eski Para Al Sat",
  description:
    "Cumhuriyet ve Osmanlı dönemine ait eski paralar. Koleksiyon ve yatırım amaçlı satış.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Genel iletişim için kullanılacak mesaj
  const genericMessage =
    "Merhaba, sitenizdeki eski paralar hakkında genel bilgi almak istiyorum.";
  const globalWhatsAppLink = buildWhatsAppLink(genericMessage);

  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">
          {/* HEADER */}
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-lg font-semibold text-emerald-400">
                    ₺
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide group-hover:text-emerald-300">
                    Eski Para Al Sat
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Cumhuriyet & Osmanlı koleksiyon paraları
                  </div>
                </div>
              </Link>

              <nav className="flex items-center gap-3 text-sm">
                <Link
                  href="/"
                  className="px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-200"
                >
                  Tüm Paralar
                </Link>
                <Link
                  href="/cumhuriyet"
                  className="px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-200"
                >
                  Cumhuriyet
                </Link>
                <Link
                  href="/osmanli"
                  className="px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-200"
                >
                  Osmanlı
                </Link>
                <Link
                  href="/admin/login"
                  className="ml-2 text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="border-t border-slate-800 bg-slate-950/90">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
              <div>
                © {new Date().getFullYear()} Eski Para Al Sat — Tüm hakları
                saklıdır.
              </div>
              <div className="text-[11px] text-slate-500">
                Satın almak için ilginizi çeken paranın kartındaki{" "}
                <span className="text-emerald-400 font-medium">WhatsApp</span>{" "}
                butonunu veya sağ alttaki genel{" "}
                <span className="text-emerald-400 font-medium">WhatsApp</span>{" "}
                butonunu kullanarak iletişim kurabilirsiniz.
              </div>
            </div>
          </footer>
        </div>

             {/* SAĞ ALTA GENEL WHATSAPP BUTONU (YUVARLAK, SADECE İKON) */}
        <a
          href={globalWhatsAppLink}
          target="_blank"
          rel="noreferrer"
          className="fixed z-40 bottom-20 right-4 sm:bottom-6 sm:right-6
                     h-12 w-12 rounded-full bg-emerald-600 text-white
                     flex items-center justify-center
                     shadow-lg shadow-emerald-900/60
                     hover:bg-emerald-500 transition"
          aria-label="WhatsApp ile iletişime geç"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

      </body>
    </html>
  );
}
