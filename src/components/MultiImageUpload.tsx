"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { saveImage, getImage, createStoredImageUrl, getStoredImageId, isStoredImage } from "@/lib/imageStorage";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUpload({ 
  images, 
  onChange, 
  label = "Imágenes del producto",
  maxImages = 5 
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar imágenes reales para mostrar
  useEffect(() => {
    const loadImages = async () => {
      const loaded: string[] = [];
      for (const img of images) {
        if (isStoredImage(img)) {
          const id = getStoredImageId(img);
          if (id) {
            const dataUrl = await getImage(id);
            loaded.push(dataUrl || img);
          } else {
            loaded.push(img);
          }
        } else {
          loaded.push(img);
        }
      }
      setDisplayImages(loaded);
    };
    loadImages();
  }, [images]);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    if (remainingSlots === 0) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    setIsLoading(true);
    const newImageUrls: string[] = [];

    for (const file of Array.from(files).slice(0, filesToProcess)) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Validar tamaño (máximo 2MB para IndexedDB)
      if (file.size > 2 * 1024 * 1024) {
        alert(`"${file.name}" es demasiado grande. Máximo 2MB para modo demo. Usa URLs de imágenes externas para archivos más grandes.`);
        continue;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Guardar en IndexedDB y obtener URL virtual
        const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await saveImage(imageId, dataUrl);
        newImageUrls.push(createStoredImageUrl(imageId));
      } catch (error) {
        console.error(`Error al procesar ${file.name}:`, error);
      }
    }

    onChange([...images, ...newImageUrls]);
    setIsLoading(false);
  }, [images, maxImages, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
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
    handleFileChange(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [handleFileChange]);

  const removeImage = useCallback((index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  }, [images, onChange]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  }, [images, onChange]);

  const addImageFromUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    if (images.length >= maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }
    // Validar que sea URL válida
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('La URL debe comenzar con http:// o https://');
      return;
    }
    onChange([...images, url.trim()]);
  }, [images, maxImages, onChange]);

  const [urlInput, setUrlInput] = useState("");

  const remainingSlots = maxImages - images.length;

  return (
    <div className="space-y-4">
      <label className="block font-cinzel text-sm text-[#6B4423]">
        {label}
        <span className="font-cormorant text-[#6B4423]/60 ml-2">
          ({images.length}/{maxImages})
        </span>
      </label>

      {/* Grid de imágenes */}
      {displayImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {displayImages.map((image, index) => (
            <div
              key={`${images[index] || image}-${index}`}
              className={`relative aspect-square bg-[#F6D3B3]/10 rounded-lg overflow-hidden group ${
                index === 0 ? "ring-2 ring-[#6B4423]" : ""
              }`}
            >
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Badge de imagen principal */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-[#6B4423] text-[#F6D3B3] text-[10px] px-2 py-0.5 rounded font-cinzel">
                  Principal
                </div>
              )}

              {/* Controles */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    disabled={index === 0}
                    className="p-1.5 bg-white text-[#6B4423] rounded hover:bg-[#F6D3B3] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover izquierda"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    disabled={index === images.length - 1}
                    className="p-1.5 bg-white text-[#6B4423] rounded hover:bg-[#F6D3B3] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover derecha"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Eliminar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Número de orden */}
              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-cormorant">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Área de subida (solo si hay espacio) */}
      {remainingSlots > 0 && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
              isDragging
                ? "border-[#6B4423] bg-[#6B4423]/5"
                : "border-[#6B4423]/30 hover:border-[#6B4423]/60"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="text-center">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-3 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin mx-auto"></div>
                  <p className="font-cormorant text-sm text-[#6B4423]">Cargando...</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 mx-auto mb-2 bg-[#F6D3B3]/20 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#6B4423]" />
                  </div>
                  <p className="font-cormorant text-sm text-[#6B4423]">
                    Arrastra imágenes aquí o haz clic para seleccionar
                  </p>
                  <p className="font-cormorant text-xs text-[#6B4423]/60 mt-1">
                    Máximo {remainingSlots} más • JPG, PNG, WEBP • 2MB cada una
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Opción URL */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4423]/40" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageFromUrl(urlInput);
                    setUrlInput("");
                  }
                }}
                placeholder="O agrega URL de imagen (https://...)"
                className="w-full pl-9 pr-4 py-2 border border-[#6B4423]/20 font-cormorant text-sm focus:outline-none focus:border-[#6B4423]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                addImageFromUrl(urlInput);
                setUrlInput("");
              }}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-[#6B4423] text-[#F6D3B3] font-cinzel text-sm disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </>
      )}

      <p className="font-cormorant text-xs text-[#6B4423]/60">
        💡 La primera imagen será la principal. Para imágenes grandes, usa URLs externas (Unsplash, Cloudinary, etc.)
      </p>
    </div>
  );
}
