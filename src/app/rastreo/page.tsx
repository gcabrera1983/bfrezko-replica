'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle, MapPin, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import OrderTimeline from '@/components/OrderTimeline'

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get('orden') || ''
  
  const [orderId, setOrderId] = useState(initialOrderId)
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Buscar orden al cargar si hay ID en URL
  useEffect(() => {
    if (initialOrderId) {
      searchOrder(initialOrderId)
    }
  }, [initialOrderId])

  const searchOrder = async (id: string) => {
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const cleanId = id.replace('#', '').trim()
      
      // En modo demo, buscar en localStorage
      const pendingOrder = localStorage.getItem('pendingOrder')
      
      if (pendingOrder) {
        const parsedOrder = JSON.parse(pendingOrder)
        // Verificar si el ID coincide
        if (parsedOrder.id === cleanId || parsedOrder.id.includes(cleanId)) {
          // Crear datos de demo para mostrar
          const demoOrder = {
            ...parsedOrder,
            status: 'SHIPPED',
            trackingNumber: 'GT-' + Math.floor(Math.random() * 1000000),
            carrier: 'Cargo Expreso',
            shippedAt: new Date(Date.now() - 86400000).toISOString(),
            paymentStatus: 'PENDING',
            items: parsedOrder.items || [],
            trackingHistory: [
              {
                id: '1',
                status: 'PENDING',
                description: 'Orden recibida',
                location: 'Tienda Online',
                createdAt: new Date(Date.now() - 259200000).toISOString()
              },
              {
                id: '2',
                status: 'PROCESSING',
                description: 'Pedido en preparación',
                location: 'Bodega Ágape',
                createdAt: new Date(Date.now() - 172800000).toISOString()
              },
              {
                id: '3',
                status: 'SHIPPED',
                description: 'Enviado vía Cargo Expreso',
                location: 'Centro de Distribución',
                createdAt: new Date(Date.now() - 86400000).toISOString()
              }
            ]
          }
          
          // Verificar email si se proporcionó
          if (email && demoOrder.customer?.email !== email) {
            setError('El correo no coincide con la orden')
            setLoading(false)
            return
          }
          
          setOrder(demoOrder)
          setLoading(false)
          return
        }
      }
      
      // Si no está en localStorage, intentar con la API
      try {
        const response = await fetch(`/api/orders/${cleanId}`)
        if (response.ok) {
          const data = await response.json()
          if (email && data.customerEmail !== email) {
            setError('El correo no coincide con la orden')
            setLoading(false)
            return
          }
          setOrder(data)
          setLoading(false)
          return
        }
      } catch (e) {
        // API falló, continuar con error
      }
      
      setError('Orden no encontrada. Verifica el número de orden.')
    } catch (err: any) {
      setError(err.message || 'Error buscando la orden')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderId.trim()) {
      setError('Ingresa el número de orden')
      return
    }

    await searchOrder(orderId)
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <header className="bg-[#6B4423] text-[#F6D3B3]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#F6D3B3]/80 hover:text-[#F6D3B3] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-cormorant">Volver a la tienda</span>
          </Link>
          <h1 className="font-cinzel text-2xl mt-4">Rastrea tu Pedido</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel text-sm text-[#6B4423] mb-2">
                  Número de Orden
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Ej: ORD-123456"
                    className="w-full pl-10 pr-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-cinzel text-sm text-[#6B4423] mb-2">
                  Correo Electrónico (opcional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 font-cormorant bg-red-50 p-3 rounded">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar Pedido
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resultados */}
        {order && (
          <div className="space-y-6">
            {/* Resumen de la orden */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="font-cormorant text-sm text-[#6B4423]/60">Orden #</p>
                  <p className="font-cinzel text-xl text-[#6B4423]">{order.id?.slice(-8).toUpperCase() || order.id}</p>
                </div>
                <StatusBadge status={order.status || 'PENDING'} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-cinzel text-sm text-[#6B4423] mb-1">Fecha del pedido</p>
                  <p className="font-cormorant text-[#6B4423]/80">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-GT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="font-cinzel text-sm text-[#6B4423] mb-1">Total</p>
                  <p className="font-cormorant text-xl text-[#6B4423]">
                    {formatPrice((order.total || 0) + (order.shippingCost || 0))}
                  </p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <p className="font-cinzel text-sm text-[#6B4423] mb-1">Número de guía</p>
                    <p className="font-cormorant text-[#6B4423] font-medium">{order.trackingNumber}</p>
                    {order.carrier && (
                      <p className="font-cormorant text-sm text-[#6B4423]/60">{order.carrier}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline de tracking */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-6">Historial del Pedido</h2>
              <OrderTimeline history={order.trackingHistory || []} currentStatus={order.status || 'PENDING'} />
            </div>

            {/* Productos */}
            {order.items && order.items.length > 0 && (
              <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
                <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Productos</h2>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b border-[#6B4423]/10 last:border-0">
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name || item.product?.name}
                        className="w-16 h-20 object-cover bg-[#F6D3B3]/10"
                      />
                      <div className="flex-1">
                        <p className="font-cinzel text-sm text-[#6B4423]">{item.name || item.product?.name}</p>
                        <p className="font-cormorant text-sm text-[#6B4423]/60">
                          {item.color} / {item.size} · Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="font-cormorant text-[#6B4423]">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dirección de envío */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Dirección de Envío</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6B4423] mt-0.5" />
                <div className="font-cormorant text-[#6B4423]">
                  <p className="font-medium">{order.customerName || order.customer?.name}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.department}</p>
                  <p>{order.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ayuda */}
        {!order && (
          <div className="bg-[#F6D3B3]/20 rounded-lg p-6 text-center">
            <Truck className="w-12 h-12 text-[#6B4423]/40 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg text-[#6B4423] mb-2">¿Necesitas ayuda?</h3>
            <p className="font-cormorant text-[#6B4423]/70 mb-4">
              Si tienes problemas para rastrear tu pedido, contáctanos
            </p>
            <a 
              href="mailto:hola@agapestudio.com"
              className="inline-block px-6 py-2 border border-[#6B4423] text-[#6B4423] font-cormorant hover:bg-[#6B4423] hover:text-[#F6D3B3] transition-colors"
            >
              hola@agapestudio.com
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PAID': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-purple-100 text-purple-800',
    'READY': 'bg-indigo-100 text-indigo-800',
    'SHIPPED': 'bg-[#889E81]/20 text-[#889E81]',
    'IN_TRANSIT': 'bg-[#889E81]/20 text-[#889E81]',
    'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }

  const labels: Record<string, string> = {
    'PENDING': 'Pendiente',
    'PAID': 'Pagado',
    'PROCESSING': 'En preparación',
    'READY': 'Listo para envío',
    'SHIPPED': 'Enviado',
    'IN_TRANSIT': 'En tránsito',
    'OUT_FOR_DELIVERY': 'En reparto',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado'
  }

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-cinzel ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}
