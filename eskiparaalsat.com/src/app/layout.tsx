// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Eski Para Al Sat",
  description: "Cumhuriyet ve Osmanlı kağıt paraları koleksiyonu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#02030a] text-slate-100 antialiased">
        {/* Arka plan glow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.10),_transparent_55%)]" />
        </div>

        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:pt-8">
              {children}
            </div>
          </main>

          <footer className="border-t border-zinc-900 bg-black/40">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-[11px] text-zinc-500">
              <span>© {new Date().getFullYear()} Eski Para Al Sat</span>
              <span className="hidden sm:inline">
                Koleksiyon amaçlıdır. İletişim yalnızca WhatsApp üzerinden.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
