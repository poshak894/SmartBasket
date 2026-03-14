"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChartColumnBig, Crown, LayoutDashboard, LogOut, Settings, ShoppingCart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/compare", label: "Compare", icon: Sparkles },
  { href: "/dashboard/cart", label: "Smart Cart", icon: ShoppingCart },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Upgrade", icon: Crown }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-surface-200 bg-white/90 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-elevated">KC</div>
        <div>
          <div className="font-semibold text-surface-900">SmartBasket</div>
          <div className="text-xs text-slate-500">Live quick-commerce intelligence</div>
        </div>
      </div>

      <motion.nav initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <motion.div key={item.href} variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }} whileHover={{ x: 3 }}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-pill border border-transparent px-4 py-3 text-sm font-medium transition-all",
                  active ? "border-brand-100 bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-surface-50 hover:text-surface-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <div className="mt-auto rounded-2xl border border-surface-200 bg-surface-50 p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold text-surface-900">Rhea Kapoor</div>
            <div className="text-xs text-slate-500">Bengaluru, 560001</div>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <Badge>PRO</Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ChartColumnBig className="h-3.5 w-3.5" />
            Saved ₹847
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
