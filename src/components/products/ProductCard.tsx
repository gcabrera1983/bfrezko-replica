"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/producto/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F6D3B3]/10 mb-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            fill
            className="transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="bg-[#6B4423] text-[#F6D3B3] text-xs font-cinzel px-3 py-1 uppercase tracking-wider">
                Nuevo
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-[#889E81] text-white text-xs font-cinzel px-3 py-1 uppercase tracking-wider">
                Oferta
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#6B4423]/0 group-hover:bg-[#6B4423]/10 transition-colors duration-500 pointer-events-none" />
        </div>

        <div className="space-y-2">
          <h3 className="font-cinzel text-sm text-[#6B4423] line-clamp-2 group-hover:text-[#889E81] transition-colors tracking-wide">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="font-cormorant font-semibold text-[#1A1A1A]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-cormorant text-sm text-[#6B4423]/50 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.value}
                className="w-3 h-3 rounded-full border border-[#6B4423]/20"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-[#6B4423]/60 font-cormorant ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
