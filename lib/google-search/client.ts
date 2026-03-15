import { mockProductCatalog } from "@/lib/mock/data";
import { ProductWithPrices } from "@/types";

type GoogleSearchItem = {
  title?: string;
  link?: string;
  snippet?: string;
};

type GoogleSearchResponse = {
  items?: GoogleSearchItem[];
};

const QUICK_COMMERCE_DOMAINS = [
  "blinkit.com",
  "zeptonow.com",
  "swiggy.com",
  "flipkart.com",
  "bigbasket.com",
  "jiomart.com",
  "amazon.in"
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreCatalogMatch(query: string, candidate: ProductWithPrices) {
  const haystack = normalizeText([candidate.name, candidate.brand, candidate.category, ...(candidate.tags ?? [])].filter(Boolean).join(" "));
  const needles = normalizeText(query).split(" ").filter(Boolean);
  return needles.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

function matchCatalogProducts(query: string, items: GoogleSearchItem[]) {
  const candidateText = [query, ...items.flatMap((item) => [item.title ?? "", item.snippet ?? ""])].join(" ");

  return [...mockProductCatalog]
    .map((product) => ({ product, score: scoreCatalogMatch(candidateText, product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => entry.product);
}

export async function searchGoogleDiscovery(query: string, city: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const enabled = process.env.ENABLE_SCRAPING === "true";

  if (!enabled || !apiKey || !searchEngineId || !query.trim()) {
    return null;
  }

  const q = `${query} ${city} (${QUICK_COMMERCE_DOMAINS.map((domain) => `site:${domain}`).join(" OR ")})`;
  const url = new URL("https://customsearch.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", searchEngineId);
  url.searchParams.set("q", q);
  url.searchParams.set("num", "8");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Google Custom Search failed with ${response.status}`);
  }

  const payload = (await response.json()) as GoogleSearchResponse;
  const items = payload.items ?? [];
  const products = matchCatalogProducts(query, items);
  const suggestions = items
    .map((item) => item.title?.trim())
    .filter((title): title is string => Boolean(title))
    .slice(0, 6);

  return {
    products,
    suggestions
  };
}
