"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import ProductImage from "@/components/ProductImage";

export default function CarritoPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF9F3] px-4">
        <ShoppingBag className="w-16 h-16 text-[#6B4423]/20 mb-4" />
        <h1 className="font-cinzel text-2xl text-[#6B4423] mb-2">Tu carrito está vacío</h1>
        <p className="font-cormorant text-lg text-[#6B4423]/60 mb-6">
          Parece que aún no has agregado ningún producto.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center px-8 py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
        >
          Seguir Comprando
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-cinzel text-3xl text-[#6B4423] mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 py-6 border-b border-[#6B4423]/10"
                >
                  {/* Image */}
                  <Link
                    href={`/producto/${item.product.id}`}
                    className="relative w-24 h-32 bg-[#F6D3B3]/10 flex-shrink-0 overflow-hidden"
                  >
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/producto/${item.product.id}`}
                      className="font-cinzel text-sm text-[#6B4423] hover:text-[#889E81] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="font-cormorant text-sm text-[#6B4423]/60 mt-1">
                      Talla: {item.size} | Color: {item.color}
                    </p>
                    <p className="font-cormorant font-semibold text-[#1A1A1A] mt-2">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#6B4423]/30">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-cormorant font-medium w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.size, item.color)
                        }
                        className="p-2 text-[#6B4423]/40 hover:text-red-600 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-cormorant font-semibold text-[#1A1A1A]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/tienda"
                className="inline-flex items-center font-cormorant text-[#6B4423] hover:text-[#889E81] transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                Seguir Comprando
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-24 border border-[#6B4423]/10">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 font-cormorant">
                <div className="flex justify-between">
                  <span className="text-[#6B4423]/70">Subtotal</span>
                  <span className="text-[#1A1A1A]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B4423]/70">Envío</span>
                  <span>
                    {totalPrice >= 500 ? (
                      <span className="text-[#889E81]">Gratis</span>
                    ) : (
                      formatPrice(35)
                    )}
                  </span>
                </div>
                {totalPrice < 500 && (
                  <p className="font-cormorant text-xs text-[#6B4423]/50">
                    Envío gratis en compras mayores a Q500
                  </p>
                )}
              </div>

              <div className="border-t border-[#6B4423]/10 mt-4 pt-4">
                <div className="flex justify-between font-cinzel text-lg">
                  <span className="text-[#6B4423]">Total</span>
                  <span className="text-[#1A1A1A]">
                    {formatPrice(totalPrice >= 500 ? totalPrice : totalPrice + 35)}
                  </span>
                </div>
                <p className="font-cormorant text-xs text-[#6B4423]/50 mt-1">
                  Impuestos incluidos
                </p>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-6 py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider flex items-center justify-center hover:bg-[#6B4423]/90 transition-colors"
              >
                Proceder al Pago
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <div className="mt-6 text-center">
                <p className="font-cormorant text-xs text-[#6B4423]/50">
                  Envío seguro y protegido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
