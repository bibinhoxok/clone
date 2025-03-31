"use client"
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react"
import { formattedDate, formattedTime } from "./utils";
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'
import { Product, zProductSchemaUdate } from "@/schemas/productSchema";
import { z } from "zod";
import { Promotion } from "@/schemas/promotionSchema";
export const useToast = (message: string) => {
  const now = new Date(Date.now());
  return toast(message, {
    description: `${formattedDate(now)} at ${formattedTime(now)}`,
    action: {
      label: "Close",
      onClick: () => toast.dismiss()
    },
  })
}

export function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number | undefined>(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}

export function useDebounce(callback: () => void, delay: number, dependencies: any[]) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}


export type CartItem = {
  product: z.infer<typeof zProductSchemaUdate>
  quantity: number
}

type CartState = {
  items: CartItem[]
  promotion?: Promotion
  setPromottion: (promotion:Promotion|undefined) => void
  addItem: (product: z.infer<typeof zProductSchemaUdate>) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existingItem = get().items.find(
          (item) => item.product._id === product._id
        )
        if (existingItem) {
          set((state) => {
            const newItems = state.items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: Math.min((item.quantity || 0) + 1, item.product.quantity) } // Ensure quantity doesn't exceed product.quantity
                : item
            )
            return { items: newItems }
          })
          return
        }
        set((state) => {
          return { items: [...state.items, { product, quantity: 1 }] }
        })
      },
      setQuantity: (id: string, quantity:number) =>
        set((state) => {
          const item = state.items.find((item) => item.product._id === id);
          if (!item) return state; // Item not found, do nothing

          if(quantity < 1) quantity = 1;
          quantity = Math.min(quantity, item.product.quantity); // Ensure quantity doesn't exceed product.quantity
          item.quantity = quantity;
          return { items: [...state.items] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product._id !== id
          ),
        })),
      clearCart: () => set({ items: [], promotion: undefined }),
      setPromottion: (promo:Promotion|undefined) => set({ promotion: promo }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
