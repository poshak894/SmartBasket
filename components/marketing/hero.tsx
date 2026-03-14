"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="spotlight-warm relative overflow-hidden bg-brand-light py-28">
      <div className="beam-lines" />
      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-brand-primary opacity-20 blur-[150px]" />
      <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-brand-secondary/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-dark/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="mb-4 text-sm font-semibold text-brand-primary">LIVE ACROSS 8 DELIVERY APPS</p>

          <h1 className="text-6xl font-bold leading-tight text-brand-dark">
            Compare grocery carts
            <br />
            before hidden fees
            <br />
            eat your savings.
          </h1>

          <p className="mt-6 max-w-lg text-gray-600">
            SmartBasket scans Blinkit, Zepto, Instamart and others instantly and finds the cheapest checkout.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-brand-primary px-6 py-3 text-white shadow-glow transition hover:bg-brand-secondary">
              Launch demo
            </button>

            <button className="rounded-xl border border-gray-300 px-6 py-3 transition hover:border-brand-primary">
              See pricing
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="animate-float relative overflow-hidden rounded-[28px] border border-white/10 bg-brand-dark p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_38%)]" />
          <div className="absolute -right-12 top-10 h-32 w-32 rounded-full bg-brand-primary/25 blur-3xl" />
          <div className="absolute left-8 top-24 h-px w-40 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <p className="text-gray-400">Live checkout preview</p>

          <h2 className="relative mt-2 text-4xl font-bold">Rs 592 optimized</h2>

          <div className="relative mt-6 space-y-3">
            <div className="flex justify-between rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <span>Single cart</span>
              <span>Rs 663</span>
            </div>

            <div className="flex justify-between rounded-xl bg-brand-primary p-4 shadow-glow">
              <span>Optimized split</span>
              <span>Rs 592</span>
            </div>

            <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <span>Fee transparency</span>
              <span>+ Rs 34 surfaced</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
