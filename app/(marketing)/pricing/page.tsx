import { Check } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    description: "For light price checks",
    features: ["10 comparisons/day", "5 platforms", "Basic savings tracker", "No Smart Cart"]
  },
  {
    name: "Pro",
    price: "₹99/mo",
    description: "Best for households",
    features: ["Unlimited comparisons", "All 8 platforms", "Smart Cart Optimizer", "Hidden Price Detector", "10 price alerts", "Full dashboard", "CSV export"],
    featured: true
  },
  {
    name: "Team",
    price: "₹299/mo",
    description: "For families and buying groups",
    features: ["Everything in Pro", "5 team members", "Shared carts", "API access", "Priority support", "Custom reports"]
  }
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Pricing</Badge>
          <h1 className="mt-6 text-5xl font-black text-surface-900">Plans that scale with your savings habit.</h1>
          <p className="mt-4 text-lg text-slate-600">Start free, upgrade to Pro when Smart Cart and hidden fee detection start paying back on every order.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-[32px] border p-8 shadow-card ${tier.featured ? "border-brand-100 bg-brand-50/70 shadow-elevated" : "border-surface-200 bg-white"}`}>
              {tier.featured ? <Badge>Most popular</Badge> : null}
              <h2 className="mt-6 text-3xl font-black text-surface-900">{tier.name}</h2>
              <div className="mt-3 text-4xl font-black text-surface-900">{tier.price}</div>
              <p className="mt-3 text-sm text-slate-600">{tier.description}</p>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-success-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={tier.featured ? "default" : "secondary"}>
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
