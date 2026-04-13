"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-cormorant text-lg text-[#6B4423]/70">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6 lg:gap-8`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
