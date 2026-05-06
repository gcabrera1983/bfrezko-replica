"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import ProductImage from "./ProductImage";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Zoom hover en desktop (imagen principal)
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [hoverOrigin, setHoverOrigin] = useState({ x: 50, y: 50 });

  // Zoom/Pan en lightbox
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const safeImages = Array.isArray(images)
    ? images.filter((img): img is string => typeof img === "string" && img.length > 0)
    : [];

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [safeImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [safeImages.length]);

  // Zoom hover en imagen principal (desktop)
  const handleMainMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  // Lightbox wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    setZoomLevel((prev) => {
      const next = Math.min(Math.max(prev + delta, 1), 4);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Lightbox click toggle zoom
  const handleLightboxImageClick = useCallback(() => {
    setZoomLevel((prev) => {
      if (prev === 1) return 2.5;
      setPan({ x: 0, y: 0 });
      return 1;
    });
  }, []);

  // Pan handlers (mouse)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomLevel <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...pan };
    },
    [zoomLevel, pan]
  );

  const handleMouseMoveLightbox = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch pan handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoomLevel <= 1) return;
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart.current = { ...pan };
    },
    [zoomLevel, pan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Cerrar lightbox con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isLightboxOpen, closeLightbox, nextImage, prevImage]);

  // Bloquear scroll del body cuando lightbox está abierto
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

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

  const currentImage = safeImages[currentIndex];

  return (
    <>
      {/* Imagen Principal */}
      <div
        className="relative aspect-square bg-[#F6D3B3]/10 overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => setIsHoverZoom(true)}
        onMouseMove={handleMainMouseMove}
        onMouseLeave={() => setIsHoverZoom(false)}
        onClick={() => openLightbox(currentIndex)}
      >
        <ProductImage
          src={currentImage}
          alt={`${productName} - ${currentIndex + 1}`}
          fill
          priority
          className={`object-cover transition-transform duration-200 ease-out ${
            isHoverZoom ? "scale-[1.75]" : "scale-100"
          }`}
          // @ts-ignore - style con custom properties
          style={
            isHoverZoom
              ? { transformOrigin: `${hoverOrigin.x}% ${hoverOrigin.y}%` }
              : undefined
          }
        />

        {/* Icono de expandir (visible al hover) */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-cormorant z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Click para ampliar</span>
        </div>

        {safeImages.length > 1 && (
          <>
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
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-cormorant z-10">
              {currentIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
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
      )}

      {/* Lightbox / Modal de Zoom */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          onWheel={handleWheel}
        >
          {/* Header del lightbox */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="font-cormorant text-sm">
                {currentIndex + 1} / {safeImages.length}
              </span>
              <span className="font-cormorant text-sm text-white/60">{productName}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Controles de zoom */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => {
                    const next = Math.max(1, prev - 0.5);
                    if (next === 1) setPan({ x: 0, y: 0 });
                    return next;
                  });
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="font-cormorant text-sm w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => Math.min(4, prev + 0.5));
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button
                onClick={closeLightbox}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Área de imagen */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMoveLightbox}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Navegación izquierda */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Imagen ampliada */}
            <img
              src={currentImage}
              alt={`${productName} - vista ampliada`}
              draggable={false}
              className={`max-w-[90vw] max-h-[80vh] object-contain select-none transition-transform duration-150 ease-out ${
                zoomLevel > 1
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-zoom-in"
              }`}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxImageClick();
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/800x800/F6D3B3/6B4423?text=Imagen+no+disponible";
              }}
            />

            {/* Navegación derecha */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Hint de zoom */}
            {zoomLevel === 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-cormorant pointer-events-none animate-pulse">
                Click o scroll para hacer zoom · Arrastra para mover
              </div>
            )}
          </div>

          {/* Thumbnails en lightbox */}
          {safeImages.length > 1 && (
            <div className="px-4 py-3 flex gap-2 overflow-x-auto justify-center">
              {safeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-14 h-14 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-[#F6D3B3] opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productName} miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/100x100/F6D3B3/6B4423?text=N/A";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
