"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Check, ShoppingBag, Truck, RotateCcw, Shield, Loader2 } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import ImageGallery from "@/components/ImageGallery";


export default function ProductPage() {
  const params = useParams();
  const { getProductById, products, isLoading: isProductsLoading } = useProducts();
  const product = getProductById(params.id as string);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  // Las imágenes vienen directamente del producto (URLs de Unsplash o referencias)
  const productImages = product?.images?.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : [];

  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6B4423] animate-spin mx-auto mb-4" />
          <p className="font-cormorant text-[#6B4423]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF9F3] px-4">
        <h1 className="font-cinzel text-2xl text-[#6B4423] mb-4">Producto no encontrado</h1>
        <Link
          href="/tienda"
          className="font-cormorant text-[#6B4423] underline hover:no-underline"
        >
          Ver todos los productos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    addToCart({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Get related products (same category or bestsellers)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Breadcrumb */}
      <div className="bg-[#F6D3B3]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm font-cormorant">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-[#6B4423]/70 hover:text-[#6B4423]">
                  Inicio
                </Link>
              </li>
              <li className="text-[#6B4423]/30">/</li>
              <li>
                <Link href="/tienda" className="text-[#6B4423]/70 hover:text-[#6B4423]">
                  Tienda
                </Link>
              </li>
              <li className="text-[#6B4423]/30">/</li>
              <li className="text-[#6B4423] truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery 
              images={productImages.length > 0 ? productImages : [product.image]} 
              productName={product.name}
            />
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2">
              {product.isNew && (
                <span className="inline-block bg-[#6B4423] text-[#F6D3B3] text-xs font-cinzel px-3 py-1 uppercase tracking-wider">
                  Nuevo
                </span>
              )}
            </div>
            <h1 className="font-cinzel text-2xl md:text-3xl text-[#6B4423] mb-4 tracking-wide">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-cormorant text-2xl font-semibold text-[#1A1A1A]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-cormorant text-lg text-[#6B4423]/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="font-cormorant text-lg text-[#1A1A1A]/70 mb-8 leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <h3 className="font-cinzel text-sm uppercase tracking-wider text-[#6B4423] mb-3">
                Color: <span className="font-cormorant normal-case">{selectedColor || "Selecciona"}</span>
              </h3>
              <div className="flex gap-2">
                {(product.colors || []).map((color, index) => {
                  const colorName = color?.name || `Color ${index + 1}`;
                  const colorValue = color?.value || "#cccccc";
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={`${colorValue}-${index}`}
                      type="button"
                      onClick={() => {
                        console.log('[ProductPage] Color seleccionado:', colorName);
                        setSelectedColor(colorName);
                      }}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all active:scale-95 ${
                        isSelected
                          ? "border-[#6B4423] ring-2 ring-[#6B4423] ring-offset-2"
                          : "border-[#6B4423]/30 hover:border-[#6B4423]"
                      }`}
                      style={{ backgroundColor: colorValue }}
                      title={colorName}
                      aria-label={`Seleccionar ${colorName}`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <h3 className="font-cinzel text-sm uppercase tracking-wider text-[#6B4423] mb-3">Talla</h3>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || []).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 font-cinzel transition-all ${
                      selectedSize === size
                        ? "border-[#6B4423] bg-[#6B4423] text-[#F6D3B3]"
                        : "border-[#6B4423]/30 text-[#6B4423] hover:border-[#6B4423]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-cinzel text-sm uppercase tracking-wider text-[#6B4423] mb-3">Cantidad</h3>
              <div className="flex items-center border border-[#6B4423]/30 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-cormorant text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-cormorant font-semibold w-12 text-center text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 font-cormorant text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className={`w-full py-4 font-cinzel uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                addedToCart
                  ? "bg-[#889E81] text-white"
                  : "bg-[#6B4423] text-[#F6D3B3] hover:bg-[#6B4423]/90 disabled:bg-[#6B4423]/30 disabled:cursor-not-allowed"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Agregado al Carrito
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Agregar al Carrito
                </>
              )}
            </button>

            {!selectedSize || !selectedColor ? (
              <p className="font-cormorant text-sm text-[#6B4423]/60 mt-2 text-center">
                Selecciona talla y color para continuar
              </p>
            ) : null}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#6B4423]/10">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#889E81]" />
                <p className="font-cormorant text-xs text-[#6B4423]/70">Envío Gratis</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#889E81]" />
                <p className="font-cormorant text-xs text-[#6B4423]/70">Devoluciones 30 días</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#889E81]" />
                <p className="font-cormorant text-xs text-[#6B4423]/70">Garantía</p>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-[#6B4423]/10">
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tienda?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-1 bg-[#F6D3B3]/20 font-cormorant text-sm text-[#6B4423] hover:bg-[#F6D3B3]/40 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#F6D3B3]/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-cinzel text-2xl text-[#6B4423] mb-8 text-center">También te puede gustar</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      )}
    </div>
  );
}
