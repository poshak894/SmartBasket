"use client";

import Link from "next/link";

import Logo from "@/components/logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <div className="hidden gap-8 text-sm font-medium md:flex">
          <Link href="#features" className="transition hover:text-brand-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="transition hover:text-brand-primary">
            How it works
          </Link>
          <Link href="/pricing" className="transition hover:text-brand-primary">
            Pricing
          </Link>
          <Link href="#testimonials" className="transition hover:text-brand-primary">
            Reviews
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-700 hover:text-brand-primary">
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-brand-primary px-5 py-2 text-white shadow-glow transition hover:bg-brand-secondary"
          >
            Start comparing
          </Link>
        </div>
      </div>
    </nav>
  );
}
