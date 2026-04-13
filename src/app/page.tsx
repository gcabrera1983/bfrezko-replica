"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import ProductGrid from "@/components/products/ProductGrid";
import Logo from "@/components/Logo";

export default function Home() {
  const { products } = useProducts();
  
  const newArrivals = products.filter(p => p.isNew);
  const bestsellers = products.filter(p => p.isBestseller);

  return (
    <div className="bg-[#FDF9F3]">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&auto=format&fit=crop"
            alt="Ágape Studio Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#1A1A1A]/50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Logo variant="light" size="lg" showTagline />
          <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-[#F6D3B3] mt-8 mb-6 tracking-wide">
            ROPA CRISTIANA
            <br />
            <span className="text-[#F6D3B3]/90">CON PROPÓSITO</span>
          </h1>
          <p className="font-cormorant text-xl md:text-2xl text-[#F6D3B3]/80 mb-10 max-w-2xl mx-auto italic">
            "Cada prenda es un recordatorio del amor incondicional del Padre"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#F6D3B3] text-[#6B4423] font-cinzel uppercase tracking-wider hover:bg-[#F6D3B3]/90 transition-colors"
            >
              Explorar Tienda
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/nosotros"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#F6D3B3] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#F6D3B3]/10 transition-colors"
            >
              Nuestra Historia
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 lg:py-28 bg-[#6B4423]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="font-cinzel text-sm tracking-[0.3em] text-[#F6D3B3]/60 uppercase">Nuestra Misión</span>
          <h2 className="font-cinzel text-2xl md:text-3xl lg:text-4xl text-[#F6D3B3] mt-4 mb-8 leading-relaxed">
            Expandir el mensaje del amor incondicional y la misericordia del Padre a través de cada prenda que creamos
          </h2>
          <p className="font-cormorant text-lg text-[#F6D3B3]/70">
            Queremos que nuestra ropa sea una forma de comunicar fe, esperanza y redención.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#FDF9F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Con Propósito",
                description: "Cada diseño tiene un significado profundo que te recuerda el amor del Padre."
              },
              {
                title: "Calidad Premium",
                description: "Materiales seleccionados para brindarte comodidad y durabilidad."
              },
              {
                title: "Testimonio Vivo",
                description: "Viste tu fe y comparte el mensaje de esperanza con el mundo."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 border border-[#6B4423]/10 bg-white/50">
                <h3 className="font-cinzel text-xl text-[#6B4423] mb-4 tracking-wide">{feature.title}</h3>
                <p className="font-cormorant text-lg text-[#1A1A1A]/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">Nuevos</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-2">Lanzamientos</h2>
            </div>
            <Link
              href="/tienda"
              className="hidden sm:inline-flex items-center font-cormorant text-[#6B4423] hover:text-[#889E81] transition-colors"
            >
              Ver Todo
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals.slice(0, 4)} />
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/tienda"
              className="inline-flex items-center font-cormorant text-[#6B4423]"
            >
              Ver Todo
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Meaning Section */}
      <section className="py-16 lg:py-24 bg-[#889E81]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-[#1A1A1A] p-12 flex justify-center">
                <Logo variant="light" size="lg" showTagline />
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">El Significado</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-4 mb-6">
                Unconditional Love
              </h2>
              <p className="font-cormorant text-lg text-[#1A1A1A]/80 mb-6 leading-relaxed">
                Nuestro logo representa la <strong>"U" invertida</strong> de <strong>Unconditional</strong> — 
                el amor ágape del Padre. Ese amor que no depende de lo que somos o de lo que hicimos, 
                sino del amor perfecto del Padre hacia nosotros.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center font-cinzel text-[#6B4423] uppercase tracking-wider hover:text-[#889E81] transition-colors"
              >
                Conoce Nuestra Historia
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">Favoritos</span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-2">Más Vendidos</h2>
          </div>
          <ProductGrid products={bestsellers.slice(0, 4)} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 bg-[#6B4423]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-cinzel text-2xl md:text-3xl text-[#F6D3B3] mb-4">
            Únete a la Familia Ágape
          </h2>
          <p className="font-cormorant text-lg text-[#F6D3B3]/80 mb-8">
            Suscríbete para recibir inspiración, lanzamientos exclusivos y un 10% de descuento en tu primera compra.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-6 py-4 bg-transparent border border-[#F6D3B3]/30 text-[#F6D3B3] placeholder-[#F6D3B3]/50 focus:outline-none focus:border-[#F6D3B3] font-cormorant transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#F6D3B3] text-[#6B4423] font-cinzel uppercase tracking-wider hover:bg-[#F6D3B3]/90 transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
