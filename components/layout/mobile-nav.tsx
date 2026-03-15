"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutDashboard, Settings, ShoppingCart, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/compare", icon: Sparkles, label: "Compare" },
  { href: "/dashboard/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center rounded-xl py-2 text-[11px] font-medium transition",
                active ? "bg-brand-50 text-brand-600" : "text-slate-500"
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
