import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartItem, ProductWithPrices } from "@/types";

type CartState = {
  items: CartItem[];
  productMap: Record<string, ProductWithPrices>;
  addItem: (product: ProductWithPrices) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      productMap: {},
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);
          return {
            items: existing
              ? state.items.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item))
              : [...state.items, { productId: product.id, quantity: 1 }],
            productMap: {
              ...state.productMap,
              [product.id]: product
            }
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const items = state.items
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0);

          if (items.some((item) => item.productId === productId)) {
            return { items };
          }

          const nextProductMap = { ...state.productMap };
          delete nextProductMap[productId];

          return {
            items,
            productMap: nextProductMap
          };
        }),
      removeItem: (productId) =>
        set((state) => {
          const nextProductMap = { ...state.productMap };
          delete nextProductMap[productId];

          return {
            items: state.items.filter((item) => item.productId !== productId),
            productMap: nextProductMap
          };
        })
    }),
    {
      name: "smartbasket-cart"
    }
  )
);
