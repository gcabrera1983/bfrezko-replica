'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Truck, MapPin, Loader2 } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      const pendingOrder = localStorage.getItem('pendingOrder')
      if (pendingOrder) {
        setOrder(JSON.parse(pendingOrder))
      }
      setLoading(false)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6B4423] animate-spin mx-auto mb-4" />
          <p className="font-cormorant text-[#6B4423]">Confirmando tu orden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg border border-[#6B4423]/10 text-center">
          <div className="w-20 h-20 bg-[#889E81]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#889E81]" />
          </div>

          <h1 className="font-cinzel text-3xl text-[#6B4423] mb-4">
            ¡Pedido Confirmado!
          </h1>

          <p className="font-cormorant text-lg text-[#6B4423]/70 mb-2">
            Gracias por tu compra. Hemos recibido tu pedido correctamente.
          </p>

          <p className="font-cormorant text-sm text-[#6B4423]/50 mb-8">
            Número de orden: <span className="font-mono">#{orderId?.slice(-8).toUpperCase()}</span>
          </p>

          {/* Info de pago contra entrega */}
          <div className="bg-[#F6D3B3]/20 p-6 rounded-lg mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6B4423] rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#F6D3B3]" />
              </div>
              <div>
                <h3 className="font-cinzel text-[#6B4423]">Pago Contra Entrega</h3>
                <p className="font-cormorant text-sm text-[#6B4423]/70">
                  Paga en efectivo al recibir tu pedido
                </p>
              </div>
            </div>
            
            {order && (
              <div className="border-t border-[#6B4423]/20 pt-4">
                <div className="flex justify-between font-cormorant mb-2">
                  <span className="text-[#6B4423]/70">Monto a pagar:</span>
                  <span className="font-cinzel text-lg text-[#6B4423]">
                    Q{((order?.total || 0) + (order?.shippingCost || 35)).toFixed(2)}
                  </span>
                </div>
                <p className="font-cormorant text-xs text-[#6B4423]/60">
                  Ten el monto exacto listo para el repartidor
                </p>
              </div>
            )}
          </div>

          {/* Tracking info */}
          <div className="bg-[#889E81]/10 p-6 rounded-lg mb-8 text-left">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-[#889E81] flex-shrink-0" />
              <div>
                <h3 className="font-cinzel text-[#6B4423] mb-2">Seguimiento de tu pedido</h3>
                <p className="font-cormorant text-sm text-[#6B4423]/70 mb-4">
                  Te enviaremos un correo con tu número de guía cuando tu pedido sea enviado. 
                  Podrás rastrearlo en cualquier momento.
                </p>
                <Link
                  href={`/rastreo?orden=${orderId}`}
                  className="inline-block px-6 py-2 bg-[#6B4423] text-[#F6D3B3] font-cinzel text-sm uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
                >
                  Rastrear mi Pedido
                </Link>
              </div>
            </div>
          </div>

          {order && (
            <div className="bg-[#F6D3B3]/10 p-4 rounded-lg mb-8 text-left">
              <h2 className="font-cinzel text-sm text-[#6B4423] mb-4 uppercase tracking-wider">
                Resumen del pedido
              </h2>
              
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between font-cormorant text-sm">
                    <span className="text-[#6B4423]/80">
                      {item.quantity}x {item.name}
                      <span className="text-[#6B4423]/50 ml-1">
                        ({item.size}, {item.color})
                      </span>
                    </span>
                    <span>Q{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#6B4423]/20 pt-3 mt-3">
                <div className="flex justify-between font-cormorant">
                  <span className="text-[#6B4423]/70">Total</span>
                  <span className="font-cinzel text-lg">Q{((order?.total || 0) + (order?.shippingCost || 35)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="font-cormorant text-sm text-[#6B4423]/70">
              Te hemos enviado un correo de confirmación a:<br />
              <strong className="text-[#6B4423]">{order?.customer?.email}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                href={`/rastreo?orden=${orderId}`}
                className="px-8 py-3 border-2 border-[#6B4423] text-[#6B4423] font-cinzel uppercase tracking-wider hover:bg-[#6B4423] hover:text-[#F6D3B3] transition-colors"
              >
                Rastrear Pedido
              </Link>
              <Link
                href="/tienda"
                className="px-8 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="font-cormorant text-sm text-[#6B4423]/50">
            ¿Tienes preguntas sobre tu pedido?<br />
            Contáctanos en{' '}
            <a 
              href="mailto:hola@agapestudio.com" 
              className="text-[#6B4423] hover:underline"
            >
              hola@agapestudio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
