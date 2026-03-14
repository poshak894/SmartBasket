const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const mockProductCatalog = [
  {
    id: "amul-butter",
    name: "Amul Butter 500g",
    brand: "Amul",
    category: "Dairy",
    imageUrl: "https://images.unsplash.com/photo-1589985270958-b3f9b7a7fda0?auto=format&fit=crop&w=400&q=80",
    barcode: null,
    prices: [
      ["BLINKIT", 278, 300, 0, 5, 4, 0, 287, 9],
      ["ZEPTO", 282, 300, 0, 3, 4, 6, 295, 11],
      ["INSTAMART", 282, 300, 11, 3, 4, 0, 300, 13],
      ["FLIPKART_MINUTES", 287, 300, 12, 5, 4, 0, 308, 15]
    ]
  },
  {
    id: "maggi-noodles",
    name: "Maggi 2-Minute Noodles",
    brand: "Nestle",
    category: "Snacks",
    imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=400&q=80",
    barcode: null,
    prices: [
      ["BLINKIT", 68, 90, 0, 5, 4, 0, 77, 9],
      ["ZEPTO", 72, 90, 0, 3, 4, 6, 85, 11],
      ["INSTAMART", 72, 90, 11, 3, 4, 0, 90, 13],
      ["FLIPKART_MINUTES", 77, 90, 12, 5, 4, 0, 98, 15]
    ]
  },
  {
    id: "fortune-atta",
    name: "Fortune Chakki Fresh Atta 5kg",
    brand: "Fortune",
    category: "Staples",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
    barcode: null,
    prices: [
      ["BLINKIT", 292, 314, 0, 5, 4, 0, 301, 9],
      ["ZEPTO", 296, 314, 0, 3, 4, 6, 309, 11],
      ["INSTAMART", 296, 314, 11, 3, 4, 0, 314, 13],
      ["FLIPKART_MINUTES", 301, 314, 12, 5, 4, 0, 322, 15]
    ]
  },
  {
    id: "dove-shampoo",
    name: "Dove Intense Repair Shampoo 650ml",
    brand: "Dove",
    category: "Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80",
    barcode: null,
    prices: [
      ["BLINKIT", 441, 463, 0, 5, 4, 0, 450, 9],
      ["ZEPTO", 445, 463, 0, 3, 4, 6, 458, 11],
      ["INSTAMART", 445, 463, 11, 3, 4, 0, 463, 13],
      ["FLIPKART_MINUTES", 450, 463, 12, 5, 4, 0, 471, 15]
    ]
  }
];

async function main() {
  for (const product of mockProductCatalog) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        barcode: product.barcode
      },
      create: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        barcode: product.barcode
      }
    });

    for (const [platform, price, mrp, deliveryFee, platformFee, packingFee, surgeFee, totalCost, deliveryMins] of product.prices) {
      await prisma.platformPrice.upsert({
        where: { id: `${product.id}-${platform}` },
        update: {
          productId: product.id,
          platform,
          price,
          mrp,
          deliveryFee,
          platformFee,
          packingFee,
          surgeFee,
          totalCost,
          deliveryMins,
          inStock: true,
          pincode: "560001"
        },
        create: {
          id: `${product.id}-${platform}`,
          productId: product.id,
          platform,
          price,
          mrp,
          deliveryFee,
          platformFee,
          packingFee,
          surgeFee,
          totalCost,
          deliveryMins,
          inStock: true,
          pincode: "560001"
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
