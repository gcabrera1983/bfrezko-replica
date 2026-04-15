"use client";

import ProductImage from "@/components/ProductImage";

interface AdminProductImageProps {
  src?: string | null;
  alt?: string;
  size?: "small" | "medium" | "large";
}

export default function AdminProductImage({
  src,
  alt,
  size = "small",
}: AdminProductImageProps) {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-md overflow-hidden bg-[#F6D3B3]/10 flex-shrink-0`}>
      <ProductImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}
