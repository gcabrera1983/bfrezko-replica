"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import CloudinaryUpload from "@/components/CloudinaryUpload";

export default function NuevoProductoPage() {
  const isAuthenticated = useAdmin();
  const router = useRouter();
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: [] as string[],
    category: "Colección Principal",
    tags: [] as string[],
    sizes: ["S", "M", "L", "XL"] as string[],
    colors: [] as { name: string; value: string }[],
    inStock: true,
    isNew: false,
    isBestseller: false,
  });

  const [newTag, setNewTag] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <p className="font-cormorant text-[#6B4423]">Redirigiendo...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert("Por favor sube al menos una imagen");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.images[0],
        images: formData.images,
        category: formData.category,
        tags: formData.tags,
        sizes: formData.sizes,
        colors: formData.colors,
        inStock: formData.inStock,
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
      };

      await addProduct(productData);
      router.push("/admin");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error al guardar el producto. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const addColor = () => {
    if (newColorName && !formData.colors.find(c => c.name === newColorName)) {
      setFormData(prev => ({ 
        ...prev, 
        colors: [...prev.colors, { name: newColorName, value: newColorValue }] 
      }));
      setNewColorName("");
    }
  };

  const removeColor = (colorName: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c.name !== colorName) }));
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const updateImages = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <header className="bg-[#6B4423] text-[#F6D3B3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-[#F6D3B3]/80 hover:text-[#F6D3B3] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="font-cinzel text-xl tracking-wide">Nuevo Producto</h1>
              <p className="font-cormorant text-sm text-[#F6D3B3]/70">Agregar producto a la tienda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Imágenes */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <CloudinaryUpload
              images={formData.images}
              onChange={updateImages}
              maxImages={5}
            />
          </div>

          {/* Información Básica */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Información Básica</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                  placeholder="Ej: Playera Unconditional"
                />
              </div>

              <div>
                <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Descripción *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                  placeholder="Describe el producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Precio (Q) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                    placeholder="185.00"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Precio Original (Q)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                    placeholder="250.00"
                  />
                </div>
              </div>

              <div>
                <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423] bg-white"
                >
                  <option value="Colección Principal">Colección Principal</option>
                  <option value="Edición Especial">Edición Especial</option>
                  <option value="Manga Larga">Manga Larga</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tallas */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Tallas Disponibles</h2>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-12 h-12 border-2 font-cinzel transition-all ${
                    formData.sizes.includes(size)
                      ? "border-[#6B4423] bg-[#6B4423] text-[#F6D3B3]"
                      : "border-[#6B4423]/30 text-[#6B4423] hover:border-[#6B4423]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Colores</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nombre del color"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
              />
              <input
                type="color"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                className="w-12 h-10 border border-[#6B4423]/20"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-[#6B4423] text-[#F6D3B3] font-cinzel"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 px-3 py-2 bg-[#F6D3B3]/20 rounded"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-[#6B4423]/20"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="font-cormorant text-sm">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color.name)}
                    className="text-[#6B4423]/50 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Etiquetas</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nueva etiqueta"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#6B4423] text-[#F6D3B3] font-cinzel"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-[#889E81]/20 rounded"
                >
                  <span className="font-cormorant text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#6B4423]/50 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Opciones */}
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Opciones</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-5 h-5 accent-[#6B4423]"
                />
                <span className="font-cormorant">En stock</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                  className="w-5 h-5 accent-[#6B4423]"
                />
                <span className="font-cormorant">Marcar como "Nuevo"</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) => setFormData(prev => ({ ...prev, isBestseller: e.target.checked }))}
                  className="w-5 h-5 accent-[#6B4423]"
                />
                <span className="font-cormorant">Marcar como "Bestseller"</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="flex-1 py-4 border-2 border-[#6B4423] text-[#6B4423] font-cinzel uppercase tracking-wider text-center hover:bg-[#6B4423]/5 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
