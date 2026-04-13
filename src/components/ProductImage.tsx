"use client";

import { useState, useEffect } from "react";
import { imageStorage } from "@/lib/imageStorage";

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({ 
  src, 
  alt, 
  fill = false, 
  className = "",
  priority = false
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setError(false);

      try {
        // Si es una referencia a IndexedDB
        if (src.startsWith("ref:")) {
          const imageId = src.substring(4);
          await imageStorage.init();
          const data = await imageStorage.getImage(imageId);
          if (data) {
            setImageSrc(data);
          } else {
            setError(true);
          }
        } else {
          // Es una URL o base64 directo
          setImageSrc(src);
        }
      } catch (e) {
        console.error("Error loading image:", e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`bg-[#F6D3B3]/20 animate-pulse ${fill ? 'w-full h-full' : ''} ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`bg-[#F6D3B3]/20 ${fill ? 'w-full h-full' : ''} ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center text-[#6B4423]/50">
          <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-cormorant text-sm">Sin imagen</span>
        </div>
      </div>
    );
  }

  // Usar <img> para todas las imágenes (base64 o URL externa)
  // next/image requiere configuración de dominios para URLs externas
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`object-cover ${className}`}
      style={fill ? { width: '100%', height: '100%' } : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
