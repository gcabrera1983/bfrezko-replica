"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/data/products";
import ProductGrid from "@/components/products/ProductGrid";
import { SlidersHorizontal, X } from "lucide-react";

function TiendaContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const tagParam = searchParams.get("tag");
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) => (p.category || '').toLowerCase().replace(/\s+/g, "-") === selectedCategory.toLowerCase()
      );
    }

    // Filter by tag
    if (tagParam) {
      result = result.filter((p) =>
        (p.tags || []).some((t) => t.toLowerCase().replace(/\s+/g, "-") === tagParam.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // featured - default order
        break;
    }

    return result;
  }, [products, selectedCategory, tagParam, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setSortBy("featured");
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <div className="bg-[#6B4423] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-[#F6D3B3] mb-4">
            {categoryParam
              ? categories.find((c) => c.slug === categoryParam)?.name || "Colección"
              : tagParam
              ? `Etiqueta: ${tagParam}`
              : "Nuestra Colección"}
          </h1>
          <p className="font-cormorant text-lg text-[#F6D3B3]/70">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-[#6B4423]/30 font-cinzel text-sm text-[#6B4423]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-[#6B4423] text-[#F6D3B3] text-xs w-5 h-5 rounded-full flex items-center justify-center font-cinzel">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[#6B4423]/30 font-cormorant text-[#6B4423] bg-transparent focus:outline-none focus:border-[#6B4423]"
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más Nuevos</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-cinzel text-sm uppercase tracking-[0.2em] text-[#6B4423] mb-3">
                  Categoría
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.slug}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 accent-[#6B4423]"
                      />
                      <span className="font-cormorant text-[#1A1A1A]/80 hover:text-[#6B4423] transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-cinzel text-sm uppercase tracking-[0.2em] text-[#6B4423] mb-3">
                  Precio
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-[#6B4423]"
                  />
                  <div className="flex justify-between font-cormorant text-sm text-[#6B4423]">
                    <span>Q{priceRange[0]}</span>
                    <span>Q{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center font-cormorant text-sm text-[#6B4423] hover:text-[#889E81] transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar Filtros
                </button>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-cormorant text-[#6B4423]/70">
                Mostrando {filteredProducts.length} producto
                {filteredProducts.length !== 1 ? "s" : ""}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-[#6B4423]/30 font-cormorant text-[#6B4423] bg-transparent focus:outline-none focus:border-[#6B4423]"
              >
                <option value="featured">Destacados</option>
                <option value="newest">Más Nuevos</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>

            <ProductGrid products={filteredProducts} />

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="font-cormorant text-lg text-[#6B4423]/70 mb-4">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-cormorant text-[#6B4423]">Cargando...</p>
        </div>
      </div>
    }>
      <TiendaContent />
    </Suspense>
  );
}
