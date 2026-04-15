'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Truck, Save, Loader2, Package, CheckCircle, Send } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'
import { formatPrice } from '@/lib/utils'
import OrderTimeline from '@/components/OrderTimeline'

interface OrderDetailPageProps {
  params: { id: string }
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAID', label: 'Pagado', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'En preparación', color: 'bg-purple-100 text-purple-800' },
  { value: 'READY', label: 'Listo para envío', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'SHIPPED', label: 'Enviado', color: 'bg-[#889E81]/20 text-[#889E81]' },
  { value: 'IN_TRANSIT', label: 'En tránsito', color: 'bg-[#889E81]/20 text-[#889E81]' },
  { value: 'OUT_FOR_DELIVERY', label: 'En reparto', color: 'bg-orange-100 text-orange-800' },
  { value: 'DELIVERED', label: 'Entregado', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
]

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  const { isAuthenticated } = useAdmin()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [note, setNote] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    fetchOrderFromAPI()
  }, [isAuthenticated, params.id])

  const fetchOrderFromAPI = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      if (!response.ok) throw new Error('Orden no encontrada')
      
      const data = await response.json()
      setOrder(data)
      setStatus(data.status)
      setTrackingNumber(data.trackingNumber || '')
      setCarrier(data.carrier || '')
    } catch (error) {
      console.error('Error loading order:', error)
      alert('Error cargando la orden')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          note: note || null,
          location: location || null
        })
      })

      if (!response.ok) throw new Error('Error guardando en la base de datos')

      const updated = await response.json()
      setOrder(updated)
      setNote('')
      setLocation('')
      alert('Orden actualizada correctamente')
    } catch (error: any) {
      alert(error.message || 'Error al actualizar la orden')
    } finally {
      setSaving(false)
    }
  }

  const handleSendUpdateEmail = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Error enviando email')
      alert('Notificación enviada al cliente')
    } catch (error: any) {
      alert(error.message || 'Error al enviar notificación')
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B4423] animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <p className="font-cormorant text-[#6B4423]">Orden no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      <header className="bg-[#6B4423] text-[#F6D3B3]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-[#F6D3B3]/80 hover:text-[#F6D3B3]">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="font-cinzel text-xl">Orden #{order.id?.slice(-8).toUpperCase()}</h1>
              <p className="font-cormorant text-sm text-[#F6D3B3]/70">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-GT') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Info del cliente */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Información del Cliente</h2>
              <div className="space-y-2 font-cormorant">
                <p><span className="text-[#6B4423]/60">Nombre:</span> {order.customerName}</p>
                <p><span className="text-[#6B4423]/60">Email:</span> {order.customerEmail}</p>
                <p><span className="text-[#6B4423]/60">Teléfono:</span> {order.customerPhone}</p>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Dirección de Envío</h2>
              <div className="space-y-1 font-cormorant text-[#6B4423]">
                <p>{order.address}</p>
                <p>{order.city}, {order.department}</p>
                <p>{order.postalCode}</p>
              </div>
            </div>

            {/* Productos */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Productos</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-[#6B4423]/10 last:border-0">
                    <img
                      src={item.image || item.product?.image}
                      alt={item.name || item.product?.name}
                      className="w-16 h-20 object-cover bg-[#F6D3B3]/10"
                    />
                    <div className="flex-1">
                      <p className="font-cinzel text-sm text-[#6B4423]">{item.name || item.product?.name}</p>
                      <p className="font-cormorant text-sm text-[#6B4423]/60">
                        {item.color} / {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-cormorant text-[#6B4423]">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#6B4423]/20 pt-4 mt-4">
                <div className="flex justify-between font-cormorant">
                  <span className="text-[#6B4423]/60">Subtotal</span>
                  <span>{formatPrice(order.total || 0)}</span>
                </div>
                <div className="flex justify-between font-cormorant">
                  <span className="text-[#6B4423]/60">Envío</span>
                  <span>{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between font-cinzel text-lg mt-2 pt-2 border-t border-[#6B4423]/10">
                  <span className="text-[#6B4423]">Total</span>
                  <span>{formatPrice((order.total || 0) + (order.shippingCost || 0))}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-4">Historial de Tracking</h2>
              <OrderTimeline history={order.trackingHistory || []} currentStatus={order.status} />
            </div>
          </div>

          {/* Columna derecha - Actualizar */}
          <div>
            <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6 sticky top-6">
              <h2 className="font-cinzel text-lg text-[#6B4423] mb-6">Actualizar Estado</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Estado del pedido</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white">
                    {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Número de guía
                  </label>
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Ej: GT123456789" className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant" />
                </div>

                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Transportista</label>
                  <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white">
                    <option value="">Selecciona transportista</option>
                    <option value="Cargo Expreso">Cargo Expreso</option>
                    <option value="Guatex">Guatex</option>
                    <option value="Forza">Forza</option>
                    <option value="Hermanos Vásquez">Hermanos Vásquez</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Ubicación actual</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Bodega Ágape" className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant" />
                </div>

                <div>
                  <label className="block font-cinzel text-sm text-[#6B4423] mb-2">Nota / Descripción</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Descripción del cambio..." rows={3} className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant resize-none" />
                </div>

                <button type="submit" disabled={saving} className="w-full py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase hover:bg-[#6B4423]/90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</> : <><Save className="w-5 h-5" /> Guardar Cambios</>}
                </button>

                <button 
                  type="button"
                  onClick={handleSendUpdateEmail}
                  className="w-full py-3 border-2 border-[#6B4423] text-[#6B4423] font-cinzel uppercase hover:bg-[#6B4423]/5 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Reenviar notificación al cliente
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
