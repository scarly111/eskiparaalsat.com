"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/cumhuriyet", label: "Cumhuriyet Paraları" },
  { href: "/osmanli", label: "Osmanlı Paraları" },
];

const adminItem = { href: "/admin", label: "Admin" };

const WHATSAPP_PHONE = "905468736372";

function buildQuickWhatsAppLink() {
  const text = encodeURIComponent(
    "Merhaba, sitenizdeki paralar hakkında bilgi almak istiyorum."
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || pathname === href;

  const waLink = buildQuickWhatsAppLink();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
      {/* GRID: Sol - Orta - Sağ */}
      <div className="mx-auto grid max-w-5xl grid-cols-[auto_1fr_auto] items-center px-4 py-3 sm:py-3.5">
        {/* Sol: Logo (her zaman görünecek) */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-400 text-xs font-semibold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)]">
            ₺
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
              Eski Para
            </span>
            <span className="text-sm font-medium text-zinc-50">
              Al &amp; Sat
            </span>
          </div>
        </Link>

        {/* Orta: Desktop menü (ORTADA) */}
        <div className="hidden justify-self-center md:flex">
          <nav className="flex items-center gap-2 text-[13px]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "rounded-full px-3 py-1.5 transition",
                  isActive(item.href)
                    ? "bg-zinc-100 text-black shadow-sm"
                    : "text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sağ: Desktop CTA + Mobile ikonları (EN SAĞDA) */}
        <div className="flex items-center justify-end gap-2 justify-self-end">
          {/* Desktop: WhatsApp + Admin */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-300 hover:bg-emerald-500/20"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <Link
              href={adminItem.href}
              className={classNames(
                "rounded-full px-3 py-1.5 text-[11px] font-medium",
                isActive(adminItem.href)
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900"
              )}
            >
              {adminItem.label}
            </Link>
          </div>

          {/* Mobile: hızlı WhatsApp + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/70 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            >
              <MessageCircle className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800"
              aria-label="Menüyü aç"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menü sheet */}
      {open && (
        <div className="border-t border-zinc-900 bg-black/95 md:hidden">
          <div className="mx-auto max-w-5xl space-y-2 px-4 py-3">
            <nav className="flex flex-col gap-1 text-[14px]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={classNames(
                    "rounded-xl px-3 py-2 transition",
                    isActive(item.href)
                      ? "bg-zinc-100 text-black"
                      : "text-zinc-300 hover:bg-zinc-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-between pt-1">
              <Link
                href={adminItem.href}
                onClick={() => setOpen(false)}
                className={classNames(
                  "rounded-full px-3 py-1.5 text-[12px] font-medium",
                  isActive(adminItem.href)
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900"
                )}
              >
                {adminItem.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
