import { prisma } from "@/lib/prisma/client";
import { defaultPincode } from "@/lib/constants";
import { mockProductCatalog, platforms } from "@/lib/mock/data";
import { CartItem, CartOptimizationResult, Platform, PlatformPrice, ProductWithPrices, SearchApiResponse } from "@/types";

type PrismaProductRecord = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  imageUrl: string | null;
  barcode: string | null;
  prices: Array<{
    id: string;
    productId: string;
    platform: Platform;
    price: number;
    mrp: number;
    deliveryFee: number;
    platformFee: number;
    packingFee: number;
    surgeFee: number;
    totalCost: number;
    deliveryMins: number;
    inStock: boolean;
    pincode: string;
    fetchedAt: Date;
  }>;
};

function serializePrice(price: PrismaProductRecord["prices"][number]): PlatformPrice {
  return {
    ...price,
    fetchedAt: price.fetchedAt.toISOString()
  };
}

function mapProduct(record: PrismaProductRecord): ProductWithPrices {
  const prices = record.prices.map(serializePrice);
  const sorted = [...prices].sort((a, b) => a.totalCost - b.totalCost);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  return {
    id: record.id,
    name: record.name,
    brand: record.brand ?? undefined,
    category: record.category,
    imageUrl: record.imageUrl ?? undefined,
    barcode: record.barcode ?? undefined,
    prices,
    lowestPrice: cheapest?.price ?? 0,
    savingsPotential: cheapest && mostExpensive ? Number((mostExpensive.totalCost - cheapest.totalCost).toFixed(2)) : 0
  };
}

async function readProductsFromDb(query?: string): Promise<SearchApiResponse | null> {
  try {
    const where = query?.trim()
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { brand: { contains: query, mode: "insensitive" as const } },
            { category: { contains: query, mode: "insensitive" as const } }
          ]
        }
      : undefined;

    const records = await prisma.product.findMany({
      where,
      take: query?.trim() ? 12 : 8,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        prices: {
          orderBy: [{ totalCost: "asc" }]
        }
      }
    });

    if (!records.length) {
      return null;
    }

    const products = records.map((record) => mapProduct(record as PrismaProductRecord)).filter((product) => product.prices.length > 0);
    if (!products.length) {
      return null;
    }

    return {
      products,
      suggestions: ["Amul Milk", "Maggi", "Dove Shampoo"],
      total: products.length
    };
  } catch {
    return null;
  }
}

export async function searchProducts(query: string, city: string) {
  const dbResult = await readProductsFromDb(query);
  if (dbResult) {
    return dbResult;
  }

  const normalized = query.trim().toLowerCase();
  const products = mockProductCatalog.filter((product) => {
    return [product.name, product.brand, product.category, ...(product.tags ?? [])].some((value) => value?.toLowerCase().includes(normalized));
  });

  return {
    products,
    suggestions: city === "Agra" ? ["Milk", "Bread", "Eggs"] : ["Amul Milk", "Maggi", "Dove Shampoo"],
    total: products.length
  };
}

export async function getProductPrices(productId: string, pincode = defaultPincode) {
  try {
    const record = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        prices: {
          where: { pincode },
          orderBy: [{ totalCost: "asc" }]
        }
      }
    });

    if (record && record.prices.length > 0) {
      return {
        platforms: record.prices.map(serializePrice),
        updatedAt: new Date().toISOString()
      };
    }
  } catch {
    // Fall back to mock data when Prisma isn't ready yet.
  }

  const product = mockProductCatalog.find((entry) => entry.id === productId);
  if (!product) {
    return { platforms: [], updatedAt: new Date().toISOString() };
  }

  return {
    platforms: product.prices.map((price) => ({ ...price, pincode })),
    updatedAt: new Date().toISOString()
  };
}

export async function optimizeCart(items: CartItem[], preference?: { maxPlatforms?: number; maxWaitMins?: number }): Promise<CartOptimizationResult> {
  const maxPlatforms = preference?.maxPlatforms ?? 2;
  const selections = items
    .map((item) => {
      const product = mockProductCatalog.find((entry) => entry.id === item.productId);
      const sortedPrices = [...(product?.prices ?? [])]
        .filter((price) => price.inStock && price.deliveryMins <= (preference?.maxWaitMins ?? 35))
        .sort((a, b) => a.totalCost - b.totalCost);

      return { item, product, best: sortedPrices[0], fallback: sortedPrices[1] };
    })
    .filter((entry) => entry.product && entry.best);

  const grouped = new Map<Platform, CartOptimizationResult["splits"][number]>();

  for (const selection of selections) {
    const chosen = selection.item.preferredPlatform
      ? selection.product?.prices.find((price) => price.platform === selection.item.preferredPlatform)
      : selection.best;

    if (!chosen) continue;

    const current = grouped.get(chosen.platform) ?? {
      platform: chosen.platform,
      items: [],
      subtotal: 0,
      fees: chosen.deliveryFee + chosen.platformFee + chosen.packingFee + chosen.surgeFee,
      deliveryMins: chosen.deliveryMins,
      deeplink: `https://${platforms.find((platform) => platform.id === chosen.platform)?.label.toLowerCase().replace(/\s+/g, "")}.com`
    };

    current.items.push({
      productId: selection.item.productId,
      quantity: selection.item.quantity,
      unitPrice: chosen.price,
      totalPrice: chosen.price * selection.item.quantity
    });
    current.subtotal += chosen.price * selection.item.quantity;
    current.deliveryMins = Math.max(current.deliveryMins, chosen.deliveryMins);
    grouped.set(chosen.platform, current);
  }

  let splits = [...grouped.values()].sort((a, b) => a.subtotal - b.subtotal);
  if (splits.length > maxPlatforms) {
    const retained = splits.slice(0, maxPlatforms - 1);
    const overflow = splits.slice(maxPlatforms - 1).reduce(
      (acc, split) => {
        acc.items.push(...split.items);
        acc.subtotal += split.subtotal;
        acc.fees += split.fees;
        acc.deliveryMins = Math.max(acc.deliveryMins, split.deliveryMins);
        return acc;
      },
      { ...splits[maxPlatforms - 1], items: [...splits[maxPlatforms - 1].items] }
    );
    splits = [...retained, overflow];
  }

  const totalCost = splits.reduce((sum, split) => sum + split.subtotal + split.fees, 0);
  const singlePlatformCost = selections.reduce(
    (sum, selection) => sum + (((selection.fallback ?? selection.best)?.totalCost ?? 0) * selection.item.quantity),
    0
  );

  return {
    splits,
    totalCost: Number(totalCost.toFixed(2)),
    savings: Number(Math.max(singlePlatformCost - totalCost, 0).toFixed(2)),
    singlePlatformCost: Number(singlePlatformCost.toFixed(2))
  };
}

export async function getFeaturedCatalog(): Promise<ProductWithPrices[]> {
  const dbResult = await readProductsFromDb();
  if (dbResult?.products.length) {
    return dbResult.products;
  }

  return mockProductCatalog;
}
