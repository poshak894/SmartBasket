const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SOURCE_FILE = path.join(process.cwd(), "Products txt.txt");
const DEFAULT_PINCODE = "560001";

const DEFAULT_PLATFORM_ORDER = [
  "BLINKIT",
  "ZEPTO",
  "INSTAMART",
  "FLIPKART_MINUTES",
  "AMAZON_FRESH",
  "BIGBASKET_NOW",
  "JIOMART_EXPRESS"
];

const DELIVERY_MINS = {
  BLINKIT: 9,
  ZEPTO: 11,
  INSTAMART: 13,
  FLIPKART_MINUTES: 15,
  BIGBASKET_NOW: 17,
  DUNZO_DAILY: 19,
  JIOMART_EXPRESS: 21,
  AMAZON_FRESH: 23
};

const PLATFORM_ALIASES = [
  ["blinkit", "BLINKIT"],
  ["zepto", "ZEPTO"],
  ["instamart", "INSTAMART"],
  ["swiggy", "INSTAMART"],
  ["flipkart", "FLIPKART_MINUTES"],
  ["amazon", "AMAZON_FRESH"],
  ["amazo", "AMAZON_FRESH"],
  ["bigbasket", "BIGBASKET_NOW"],
  ["big", "BIGBASKET_NOW"],
  ["dmart", "DUNZO_DAILY"],
  ["dunzo", "DUNZO_DAILY"],
  ["jio", "JIOMART_EXPRESS"]
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeText(value) {
  return value.replace(/\r/g, "").replace(/[^\x20-\x7E\n]/g, " ").trim();
}

function splitBlocks(raw) {
  return raw
    .split(/\n(?=\d+\.)/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function parseHeading(line) {
  return line.replace(/^\d+\.\s*/, "").trim();
}

function inferCategory(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("apple")) return "Fruits";
  if (normalized.includes("headphone")) return "Electronics";
  if (normalized.includes("coke")) return "Beverages";
  if (normalized.includes("oreo")) return "Snacks";
  if (normalized.includes("bhujia")) return "Snacks";
  if (normalized.includes("induction") || normalized.includes("cooktop")) return "Appliances";
  if (normalized.includes("almond drop")) return "Personal Care";
  if (normalized.includes("water bottle")) return "Home";

  return "Groceries";
}

function inferBrand(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("noise")) return "Noise";
  if (normalized.includes("coke")) return "Coca-Cola";
  if (normalized.includes("oreo")) return "Oreo";
  if (normalized.includes("bikaji")) return "Bikaji";
  if (normalized.includes("bajaj")) return "Bajaj";
  if (normalized.includes("milton")) return "Milton";
  if (normalized.includes("apple")) return "Fresh";

  return undefined;
}

function parsePriceValue(value) {
  const normalized = value.toLowerCase().trim();
  if (!normalized) return null;

  if (
    normalized.includes("out of stock") ||
    normalized.includes("not available") ||
    normalized.includes("oos") ||
    normalized.includes("x")
  ) {
    return null;
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function detectPlatform(line) {
  const normalized = line.toLowerCase();

  for (const [alias, platform] of PLATFORM_ALIASES) {
    if (normalized.includes(alias)) {
      return platform;
    }
  }

  return null;
}

function parseExplicitOffer(line) {
  const platform = detectPlatform(line);
  if (!platform) return null;

  const price = parsePriceValue(line);
  return {
    platform,
    price
  };
}

function parseBlock(block) {
  const lines = block
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean);

  if (!lines.length) return null;

  const heading = parseHeading(lines[0]);
  const detailLines = lines.slice(1);
  const explicitOffers = detailLines.map(parseExplicitOffer).filter(Boolean);

  const hasExplicitPlatforms = explicitOffers.length > 0;
  const offers = hasExplicitPlatforms
    ? explicitOffers
    : detailLines.slice(0, DEFAULT_PLATFORM_ORDER.length).map((line, index) => ({
        platform: DEFAULT_PLATFORM_ORDER[index],
        price: parsePriceValue(line)
      }));

  const availablePrices = offers.map((offer) => offer.price).filter((price) => price !== null);
  if (!availablePrices.length) {
    return null;
  }

  const mrp = Math.max(...availablePrices);

  return {
    id: slugify(heading),
    name: heading,
    brand: inferBrand(heading),
    category: inferCategory(heading),
    imageUrl: null,
    offers: offers
      .filter((offer) => offer.price !== null)
      .map((offer) => ({
        platform: offer.platform,
        price: offer.price,
        mrp,
        deliveryFee: 0,
        platformFee: 0,
        packingFee: 0,
        surgeFee: 0,
        totalCost: offer.price,
        deliveryMins: DELIVERY_MINS[offer.platform]
      }))
  };
}

async function importProducts() {
  const raw = fs.readFileSync(SOURCE_FILE, "utf8");
  const blocks = splitBlocks(raw);
  const products = blocks.map(parseBlock).filter(Boolean);

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl
      },
      create: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl
      }
    });

    await prisma.platformPrice.deleteMany({
      where: {
        productId: product.id,
        pincode: DEFAULT_PINCODE
      }
    });

    for (const offer of product.offers) {
      await prisma.platformPrice.create({
        data: {
          id: `${product.id}-${offer.platform}-${DEFAULT_PINCODE}`,
          productId: product.id,
          platform: offer.platform,
          price: offer.price,
          mrp: offer.mrp,
          deliveryFee: offer.deliveryFee,
          platformFee: offer.platformFee,
          packingFee: offer.packingFee,
          surgeFee: offer.surgeFee,
          totalCost: offer.totalCost,
          deliveryMins: offer.deliveryMins,
          inStock: true,
          pincode: DEFAULT_PINCODE
        }
      });
    }
  }

  console.log(`Imported ${products.length} products from ${path.basename(SOURCE_FILE)}.`);
}

importProducts()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
