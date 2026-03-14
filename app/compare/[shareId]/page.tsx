import { ProductCard } from "@/components/compare/product-card";
import { mockProductCatalog } from "@/lib/mock/data";

export default function ShareableComparisonPage({ params }: { params: { shareId: string } }) {
  return (
    <main className="container py-20">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Shared comparison</div>
        <h1 className="mt-4 text-4xl font-black text-surface-900">Public comparison snapshot #{params.shareId}</h1>
      </div>
      <ProductCard product={mockProductCatalog[0]} />
    </main>
  );
}
