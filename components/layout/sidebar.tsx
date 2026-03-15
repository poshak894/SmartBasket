"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ChartColumnBig, Crown, LayoutDashboard, LogOut, Settings, ShoppingCart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/store/locationStore";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/compare", label: "Compare", icon: Sparkles },
  { href: "/dashboard/cart", label: "Smart Cart", icon: ShoppingCart },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Upgrade", icon: Crown }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { city, pincode } = useLocationStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Your account";
  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? undefined;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("") || "SB";

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-surface-200 bg-white/90 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-8 px-2">
        <Logo />
        <div className="mt-2 pl-[56px] text-xs text-slate-500">Live quick-commerce intelligence</div>
      </div>

      <motion.nav initial={false} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <motion.div key={item.href} variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }} initial={false} whileHover={{ x: 3 }}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-pill border border-transparent px-4 py-3 text-sm font-medium transition-all",
                  active ? "border-brand-100 bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-surface-50 hover:text-surface-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            </motion.div>
          );
        })}
      </motion.nav>

      <div className="mt-auto rounded-2xl border border-surface-200 bg-surface-50 p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold text-surface-900">{displayName}</div>
            <div className="text-xs text-slate-500">{city}, {pincode}</div>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <Badge>PRO</Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ChartColumnBig className="h-3.5 w-3.5" />
            Saved ₹847
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
