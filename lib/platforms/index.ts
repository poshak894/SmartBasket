import { prisma } from "@/lib/prisma/client";
import { defaultPincode } from "@/lib/constants";
import { mockProductCatalog, platforms } from "@/lib/mock/data";
import { amazonFreshProvider } from "@/lib/platforms/amazon-fresh";
import { bigbasketNowProvider } from "@/lib/platforms/bigbasket-now";
import { blinkitProvider } from "@/lib/platforms/blinkit";
import { dmartExpressProvider } from "@/lib/platforms/dmart-express";
import { flipkartMinutesProvider } from "@/lib/platforms/flipkart-minutes";
import { instamartProvider } from "@/lib/platforms/instamart";
import { jiomartProvider } from "@/lib/platforms/jiomart";
import { ExternalPlatformOffer, getPlatformConfig, getTotalCost, PlatformProvider, safeSlug } from "@/lib/platforms/shared";
import { zeptoProvider } from "@/lib/platforms/zepto";
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

const LIVE_TTL_MS = 1000 * 60 * 4;
const platformProviders: PlatformProvider[] = [
  blinkitProvider,
  zeptoProvider,
  instamartProvider,
  flipkartMinutesProvider,
  bigbasketNowProvider,
  dmartExpressProvider,
  jiomartProvider,
  amazonFreshProvider
];

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

function buildSearchWhere(query?: string) {
  return query?.trim()
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { brand: { contains: query, mode: "insensitive" as const } },
          { category: { contains: query, mode: "insensitive" as const } }
        ]
      }
    : undefined;
}

async function readProductsFromDb(query?: string): Promise<SearchApiResponse | null> {
  try {
    const records = await prisma.product.findMany({
      where: buildSearchWhere(query),
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

function toMockSearch(query: string, city: string): SearchApiResponse {
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

function mapExternalOfferToPlatformPrice(productId: string, platform: Platform, pincode: string, offer: ExternalPlatformOffer): PlatformPrice {
  return {
    id: offer.id ? `${productId}-${platform}-${safeSlug(offer.id)}` : `${productId}-${platform}`,
    productId,
    platform,
    price: offer.price,
    mrp: offer.mrp,
    deliveryFee: offer.deliveryFee ?? 0,
    platformFee: offer.platformFee ?? 0,
    packingFee: offer.packingFee ?? 0,
    surgeFee: offer.surgeFee ?? 0,
    totalCost: getTotalCost(offer),
    deliveryMins: offer.deliveryMins,
    inStock: offer.inStock ?? true,
    pincode,
    fetchedAt: new Date().toISOString()
  };
}

async function persistLiveOffers(productId: string, pincode: string, offersByPlatform: Map<Platform, ExternalPlatformOffer[]>) {
  const writes: Promise<unknown>[] = [];

  for (const [platform, offers] of offersByPlatform.entries()) {
    const offer = offers[0];
    if (!offer) continue;

    const priceRecord = mapExternalOfferToPlatformPrice(productId, platform, pincode, offer);

    writes.push(
      prisma.platformPrice.upsert({
        where: { id: priceRecord.id },
        update: {
          price: priceRecord.price,
          mrp: priceRecord.mrp,
          deliveryFee: priceRecord.deliveryFee,
          platformFee: priceRecord.platformFee,
          packingFee: priceRecord.packingFee,
          surgeFee: priceRecord.surgeFee,
          totalCost: priceRecord.totalCost,
          deliveryMins: priceRecord.deliveryMins,
          inStock: priceRecord.inStock,
          pincode: priceRecord.pincode,
          fetchedAt: new Date(priceRecord.fetchedAt)
        },
        create: {
          id: priceRecord.id,
          productId,
          platform,
          price: priceRecord.price,
          mrp: priceRecord.mrp,
          deliveryFee: priceRecord.deliveryFee,
          platformFee: priceRecord.platformFee,
          packingFee: priceRecord.packingFee,
          surgeFee: priceRecord.surgeFee,
          totalCost: priceRecord.totalCost,
          deliveryMins: priceRecord.deliveryMins,
          inStock: priceRecord.inStock,
          pincode: priceRecord.pincode,
          fetchedAt: new Date(priceRecord.fetchedAt)
        }
      })
    );
  }

  if (writes.length) {
    await Promise.all(writes);
  }
}

async function refreshProductPricesFromProviders(product: { id: string; name: string; barcode?: string | null }, pincode: string, city?: string) {
  const enabledProviders = platformProviders.filter((provider) => getPlatformConfig(provider.platform).enabled && provider.getProductPrices);

  if (!enabledProviders.length) {
    return null;
  }

  const settled = await Promise.allSettled(
    enabledProviders.map(async (provider) => {
      const offers = await provider.getProductPrices?.({
        productId: product.id,
        productName: product.name,
        pincode,
        city,
        barcode: product.barcode ?? undefined
      });

      return [provider.platform, offers ?? []] as const;
    })
  );

  const offersByPlatform = new Map<Platform, ExternalPlatformOffer[]>();
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value[1].length) {
      offersByPlatform.set(result.value[0], result.value[1]);
    }
  }

  if (!offersByPlatform.size) {
    return null;
  }

  try {
    await persistLiveOffers(product.id, pincode, offersByPlatform);
  } catch {
    return null;
  }

  return offersByPlatform;
}

function isStale(prices: Array<{ fetchedAt: Date | string }>) {
  if (!prices.length) return true;
  const latest = prices
    .map((price) => new Date(price.fetchedAt).getTime())
    .sort((a, b) => b - a)[0];
  return Date.now() - latest > LIVE_TTL_MS;
}

export async function searchProducts(query: string, city: string) {
  const dbResult = await readProductsFromDb(query);
  if (dbResult) {
    return dbResult;
  }

  return toMockSearch(query, city);
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

    if (record) {
      if (record.prices.length && !isStale(record.prices)) {
        return {
          platforms: record.prices.map(serializePrice),
          updatedAt: new Date().toISOString()
        };
      }

      await refreshProductPricesFromProviders(record, pincode);

      const refreshed = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          prices: {
            where: { pincode },
            orderBy: [{ totalCost: "asc" }]
          }
        }
      });

      if (refreshed && refreshed.prices.length) {
        return {
          platforms: refreshed.prices.map(serializePrice),
          updatedAt: new Date().toISOString()
        };
      }
    }
  } catch {
    // Fall back to mock data when Prisma or live providers aren't ready yet.
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
