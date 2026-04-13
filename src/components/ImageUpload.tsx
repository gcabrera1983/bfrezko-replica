"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagen del producto" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 5MB");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert("Error al cargar la imagen");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  }, [handleFileChange]);

  const clearImage = useCallback(() => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-3">
      <label className="block font-cinzel text-sm text-[#6B4423]">{label}</label>
      
      {value ? (
        <div className="relative">
          <div className="aspect-video bg-[#F6D3B3]/10 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={value} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="font-cormorant text-xs text-[#6B4423]/60 mt-2 text-center">
            Imagen cargada correctamente
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
            isDragging
              ? "border-[#6B4423] bg-[#6B4423]/5"
              : "border-[#6B4423]/30 hover:border-[#6B4423]/60"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="text-center">
            {isLoading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 border-4 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin mx-auto"></div>
                <p className="font-cormorant text-[#6B4423]">Cargando imagen...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto mb-3 bg-[#F6D3B3]/20 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#6B4423]" />
                </div>
                <p className="font-cormorant text-[#6B4423] mb-1">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="font-cormorant text-xs text-[#6B4423]/60">
                  JPG, PNG, WEBP - Máximo 5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Opción alternativa con URL */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#6B4423]/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white font-cormorant text-[#6B4423]/60">O usa una URL</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
          <input
            type="url"
            value={value.startsWith("data:") ? "" : value}
            onChange={handleUrlChange}
            placeholder="https://..."
            className="w-full pl-10 pr-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
          />
        </div>
      </div>
    </div>
  );
}
