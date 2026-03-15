"use client";

import { motion } from "framer-motion";
import { Brain, ChartColumnBig, Clock3, ReceiptIndianRupee } from "lucide-react";

import { Reveal, RevealItem, RevealStagger } from "@/components/ui/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const features = [
  {
    value: "optimizer",
    title: "Smart Cart Optimizer",
    icon: Brain,
    copy: "Split your basket across platforms to cut the total payable amount, not just shelf prices."
  },
  {
    value: "time",
    title: "Delivery Time vs Price",
    icon: Clock3,
    copy: "Tune recommendations for cheaper totals, faster ETAs, or a weighted balance of both."
  },
  {
    value: "dashboard",
    title: "Savings Dashboard",
    icon: ChartColumnBig,
    copy: "Track rupees saved, your strongest platforms, streaks, and category-level wins."
  },
  {
    value: "fees",
    title: "Hidden Price Detector",
    icon: ReceiptIndianRupee,
    copy: "See delivery, platform, packing, and surge fees before you tap checkout."
  }
];

const featureCards = [
  { title: "Cart split savings", desc: "Break one checkout into the cheapest multi-platform combination automatically." },
  { title: "ETA-aware recommendations", desc: "Balance savings against delivery speed when you need groceries fast." },
  { title: "Fee transparency", desc: "Surface delivery, platform, packing, and surge charges before checkout." },
  { title: "Platform insights", desc: "See which delivery app consistently wins for your location and basket." }
];

export function FeatureShowcase() {
  return (
    <section id="features" className="container py-20">
      <Reveal className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Why it wins</div>
        <h2 className="mt-4 text-4xl font-black text-surface-900">Every quick-commerce advantage in one operating layer.</h2>
      </Reveal>

      <Tabs defaultValue="optimizer" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
            {features.map((feature) => (
              <TabsTrigger key={feature.value} value={feature.value} className="border border-surface-200 bg-white px-5 py-3 data-[state=active]:border-brand-100 data-[state=active]:bg-brand-50">
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {features.map((feature) => (
          <TabsContent key={feature.value} value={feature.value}>
            <Reveal className="spotlight-warm relative overflow-hidden grid gap-6 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur-xl lg:grid-cols-[0.8fr_1.2fr]">
              <div className="beam-lines opacity-60" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 shadow-glow">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-3xl font-bold text-surface-900">{feature.title}</h3>
                <p className="mt-4 text-slate-600">{feature.copy}</p>
              </div>

              <RevealStagger className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-2">
                {featureCards.map((card) => (
                  <RevealItem
                    key={card.title}
                    className="group relative overflow-hidden rounded-2xl border border-brand-100/40 bg-white p-8 shadow-md transition transform hover:-translate-y-2 hover:shadow-glow"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-brand-primary/10 blur-2xl transition group-hover:bg-brand-primary/20" />
                    <div className="relative mb-3 text-2xl text-brand-primary">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="relative text-lg font-semibold">{card.title}</h3>
                    <p className="relative mt-2 text-sm text-gray-500">{card.desc}</p>
                  </RevealItem>
                ))}
              </RevealStagger>
            </Reveal>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
