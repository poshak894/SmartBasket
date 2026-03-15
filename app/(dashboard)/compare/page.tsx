import { CompareResults } from "@/components/compare/compare-results";
import { EmptyState } from "@/components/search/empty-state";
import { getFeaturedCatalog, searchProducts } from "@/lib/platforms";

export default async function ComparePage({ searchParams }: { searchParams?: { q?: string; city?: string; sort?: string; platforms?: string; inStock?: string; maxWaitMins?: string } }) {
  const params = searchParams ?? {};
  const query = params.q ?? "";
  const city = params.city ?? "Bengaluru";
  const data = query ? await searchProducts(query, city) : { products: await getFeaturedCatalog(), total: 4, suggestions: [] };

  return (
    <CompareResults
      products={data.products}
      query={query}
      emptyState={<EmptyState title={`No results for "${query}"`} subtitle="Try broader terms, a nearby city, or a category search like dairy, staples, or snacks." />}
    />
  );
}
