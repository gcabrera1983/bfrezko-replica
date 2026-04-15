"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ProductImage from "./ProductImage";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Si no hay imágenes, mostrar placeholder
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Si solo hay una imagen, mostrarla sin controles de carrusel
  if (safeImages.length === 1) {
    return (
      <div className="relative aspect-square bg-[#F6D3B3]/10">
        <ProductImage
          src={safeImages[0]}
          alt={productName}
          fill
          className="cursor-zoom-in"
          priority
        />
      </div>
    );
  }

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square bg-[#F6D3B3]/20 flex items-center justify-center">
        <div className="text-center text-[#6B4423]/50">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-cormorant">Sin imágenes</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Imagen Principal */}
      <div className="relative aspect-square bg-[#F6D3B3]/10 group">
        <ProductImage
          src={safeImages[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          fill
          className="cursor-zoom-in"
          priority
        />

        {/* Controles de navegación */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-6 h-6 text-[#6B4423]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="w-6 h-6 text-[#6B4423]" />
        </button>

        {/* Indicador de posición */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToImage(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#6B4423] w-6"
                  : "bg-[#6B4423]/40 hover:bg-[#6B4423]/60"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Contador de imágenes */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-cormorant z-10">
          {currentIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {safeImages.map((img, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? "border-[#6B4423] ring-2 ring-[#6B4423]/20"
                : "border-transparent hover:border-[#6B4423]/30"
            }`}
          >
            <ProductImage
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-[#F6D3B3] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[80vh] px-4">
            <ProductImage
              src={safeImages[currentIndex]}
              alt={`${productName} fullscreen`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {safeImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[#F6D3B3] w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
