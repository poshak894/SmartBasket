import { EmptyState } from "@/components/search/empty-state";
import { ProductCard } from "@/components/compare/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeaturedCatalog, searchProducts } from "@/lib/platforms";

export default async function DashboardComparePage({ searchParams }: { searchParams?: { q?: string; city?: string; sort?: string } }) {
  const params = searchParams ?? {};
  const query = params.q ?? "";
  const city = params.city ?? "Bengaluru";
  const data = query ? await searchProducts(query, city) : { products: await getFeaturedCatalog(), total: 4, suggestions: [] };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {["Best value", "Lowest price", "Fastest delivery", "Most savings"].map((filter) => (
          <Badge key={filter} variant={filter === "Best value" ? "default" : "outline"} className="px-4 py-2 text-sm">
            {filter}
          </Badge>
        ))}
        <Button variant="secondary">Collapse filters</Button>
      </div>

      {data.products.length ? (
        <div className="space-y-5">
          {data.products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState title={`No results for "${query}"`} subtitle="Try broader terms, a nearby city, or a category search like dairy, staples, or snacks." />
      )}
    </div>
  );
}
