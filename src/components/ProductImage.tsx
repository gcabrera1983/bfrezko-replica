"use client";

import { useState, useEffect } from "react";
import { getImage, isStoredImage, getStoredImageId } from "@/lib/imageStorage";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "", 
  fill = false,
  priority = false 
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (isStoredImage(src)) {
        const id = getStoredImageId(src);
        if (id) {
          try {
            const dataUrl = await getImage(id);
            if (dataUrl) {
              setImageSrc(dataUrl);
            }
          } catch (error) {
            console.error("Error cargando imagen de IndexedDB:", error);
          }
        }
      }
      setIsLoading(false);
    };

    loadImage();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`bg-[#F6D3B3]/20 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[#6B4423]/30 text-xs">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={(e) => {
        // Si la imagen falla, mostrar placeholder
        (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600/F6D3B3/6B4423?text=Imagen+no+disponible";
      }}
    />
  );
}
