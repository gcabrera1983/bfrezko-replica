"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct as deleteProductApi } from "@/lib/api";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde la API
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Error loading products:", err);
      setError(err.message || "Error cargando productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar productos al montar
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = useCallback(async (productData: Omit<Product, "id">) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
    } catch (err: any) {
      console.error("Error creating product:", err);
      throw err;
    }
  }, []);

  const updateProductHandler = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await updateProduct(id, updates);
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updated : product
        )
      );
    } catch (err: any) {
      console.error("Error updating product:", err);
      throw err;
    }
  }, []);

  const deleteProductHandler = useCallback(async (id: string) => {
    try {
      await deleteProductApi(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      throw err;
    }
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,
        getProductById,
        isLoading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
