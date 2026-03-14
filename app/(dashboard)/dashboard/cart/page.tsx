import { SmartCartPanel } from "@/components/cart/smart-cart-panel";

export default function DashboardCartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-surface-900">Smart Cart Optimizer</h1>
        <p className="mt-2 text-slate-600">Split orders across quick-commerce apps to minimize total checkout cost while respecting your delivery wait preferences.</p>
      </div>
      <SmartCartPanel />
    </div>
  );
}
