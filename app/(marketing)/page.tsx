import Link from "next/link";
import { Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { ProductCard } from "@/components/compare/product-card";
import { Button } from "@/components/ui/button";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/reveal";
import { mockProductCatalog } from "@/lib/mock/data";
import { softwareJsonLd } from "@/lib/seo/json-ld";

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <Navbar />
      <main className="pb-20">
        <Hero />

        <section className="container">
          <RevealStagger className="grid gap-4 rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur-xl md:grid-cols-3">
            {[
              { value: "Rs 847", label: "Average saved per active user", tone: "bg-[#8C5A3C] text-white" },
              { value: "8", label: "Platforms checked in real time", tone: "bg-[#C08552] text-white" },
              { value: "2.4M", label: "Products indexed across dark stores", tone: "bg-[#8C5A3C] text-white" }
            ].map((item) => (
              <RevealItem key={item.label} className={`rounded-2xl p-5 ${item.tone}`}>
                <div className="text-4xl font-black">{item.value}</div>
                <div className="mt-2 text-sm text-white/85">{item.label}</div>
              </RevealItem>
            ))}
          </RevealStagger>
        </section>

        <section className="container py-20">
          <Reveal className="mb-10 max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Live demo</div>
            <h2 className="mt-4 text-4xl font-black text-surface-900">Preview a real product comparison without logging in.</h2>
          </Reveal>
          <ProductCard product={mockProductCatalog[0]} />
        </section>

        <FeatureShowcase />

        <section id="how-it-works" className="container py-20">
          <RevealStagger className="grid gap-5 md:grid-cols-4">
            {[
              { step: "1", title: "Search any product", copy: "Type a grocery or essentials item and choose your city." },
              { step: "2", title: "See real checkout prices", copy: "We include delivery, packing, platform, and surge fees." },
              { step: "3", title: "Optimize your cart", copy: "Mix platforms if that lowers total payable cost." },
              { step: "4", title: "Track every rupee saved", copy: "Watch personal insights grow with every comparison." }
            ].map((item) => (
              <RevealItem key={item.step} className="rounded-[28px] border border-surface-200 bg-white p-6 shadow-card">
                <div className="text-sm font-semibold text-brand-500">Step {item.step}</div>
                <h3 className="mt-4 text-xl font-semibold text-surface-900">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </section>

        <section id="testimonials" className="container py-20">
          <RevealStagger className="grid gap-5 lg:grid-cols-3">
            {[
              ["Naina, Bengaluru", "SmartBasket catches fee traps I never noticed inside quick-commerce apps."],
              ["Akhil, Hyderabad", "The split-cart optimizer pays for Pro in a single weekly grocery run."],
              ["Mitali, Pune", "The dashboard finally shows which platform actually saves me money."]
            ].map(([name, quote]) => (
              <RevealItem key={name} className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-card">
                <div className="text-lg font-semibold text-surface-900">{name}</div>
                <p className="mt-4 text-slate-600">&quot;{quote}&quot;</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </section>

        <section className="container py-20">
          <Reveal className="rounded-[36px] border border-surface-200 bg-surface-900 p-8 text-white lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Trust signals</div>
                <h2 className="mt-4 text-4xl font-black">Independent, privacy-conscious, and built for live purchase decisions.</h2>
              </div>
              <RevealStagger className="grid gap-4 md:grid-cols-2">
                {[
                  { icon: ShieldCheck, title: "Independent recommendations" },
                  { icon: Lock, title: "Secure auth and payments" },
                  { icon: Sparkles, title: "Fresh price cache every 4 minutes" },
                  { icon: Zap, title: "Optimized for 4G performance" }
                ].map((item) => (
                  <RevealItem key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <item.icon className="h-5 w-5 text-brand-100" />
                    <div className="mt-3 font-semibold">{item.title}</div>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          </Reveal>
        </section>

        <section className="container">
          <Reveal className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-card">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-3xl font-black text-surface-900">Start with free comparisons. Upgrade when your savings do.</div>
                <p className="mt-3 text-slate-600">Free forever for casual users, or unlock the full optimizer stack for Rs 99/month.</p>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/pricing">See plans</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/signup">Create account</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
