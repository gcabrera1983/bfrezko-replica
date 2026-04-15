"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, CartContextType } from "@/types";
import { toNumber } from "@/lib/normalize";

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeCartItem(item: any): CartItem {
  return {
    product: {
      ...item.product,
      price: toNumber(item.product?.price),
      originalPrice: item.product?.originalPrice != null ? toNumber(item.product.originalPrice) : undefined,
      images: Array.isArray(item.product?.images) ? item.product.images : [],
      colors: Array.isArray(item.product?.colors) ? item.product.colors : [],
      sizes: Array.isArray(item.product?.sizes) ? item.product.sizes : [],
      tags: Array.isArray(item.product?.tags) ? item.product.tags : [],
    },
    quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1,
    size: item.size || '',
    color: item.color || '',
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount (solo cliente)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem("agape-cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setItems(parsed.map(normalizeCartItem));
          }
        }
      }
    } catch (e) {
      console.error("Error loading cart:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("agape-cart", JSON.stringify(items));
      } catch (e) {
        console.error("Error saving cart:", e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => 
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      return [...currentItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item =>
          !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
