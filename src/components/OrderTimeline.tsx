'use client'

import { Check, Package, Truck, Home, Clock, AlertCircle } from 'lucide-react'

interface TrackingEvent {
  id: string
  status: string
  description: string
  location?: string
  createdAt: string
}

interface OrderTimelineProps {
  history: TrackingEvent[]
  currentStatus: string
}

const statusConfig: Record<string, {
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}> = {
  'PENDING': {
    label: 'Orden recibida',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  'PAID': {
    label: 'Pago confirmado',
    icon: <Check className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  'PROCESSING': {
    label: 'En preparación',
    icon: <Package className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  'READY': {
    label: 'Listo para envío',
    icon: <Package className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  'SHIPPED': {
    label: 'Enviado',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-[#889E81]',
    bgColor: 'bg-[#889E81]/20'
  },
  'IN_TRANSIT': {
    label: 'En tránsito',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-[#889E81]',
    bgColor: 'bg-[#889E81]/20'
  },
  'OUT_FOR_DELIVERY': {
    label: 'En reparto',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  'DELIVERED': {
    label: 'Entregado',
    icon: <Home className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  'CANCELLED': {
    label: 'Cancelado',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
}

// Orden de los estados para mostrar en timeline completo
const statusOrder = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'READY',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
]

export default function OrderTimeline({ history, currentStatus }: OrderTimelineProps) {
  // Si no hay historial, generar uno básico basado en el estado actual
  let events = history.length > 0 ? [...history] : generateBasicHistory(currentStatus)

  // Asegurar que el estado actual siempre esté representado en el timeline
  const lastEvent = events[events.length - 1]
  if (!lastEvent || lastEvent.status !== currentStatus) {
    const config = statusConfig[currentStatus] || statusConfig['PENDING']
    events.push({
      id: `auto-${currentStatus}-${Date.now()}`,
      status: currentStatus,
      description: config?.label || `Estado: ${currentStatus}`,
      createdAt: new Date().toISOString()
    })
  }
  
  // Obtener índice del estado actual
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#6B4423]/20" />
      
      <div className="space-y-0">
        {events.map((event, index) => {
          const config = statusConfig[event.status] || statusConfig['PENDING']
          const isActive = index === events.length - 1
          
          return (
            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Icono */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                isActive ? config.bgColor : 'bg-white border-2 border-[#6B4423]/20'
              }`}>
                <span className={isActive ? config.color : 'text-[#6B4423]/40'}>
                  {config.icon}
                </span>
              </div>
              
              {/* Contenido */}
              <div className="flex-1 pt-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className={`font-cinzel font-medium ${
                    isActive ? 'text-[#6B4423]' : 'text-[#6B4423]/60'
                  }`}>
                    {config.label}
                  </h3>
                  {isActive && (
                    <span className="px-2 py-0.5 bg-[#889E81]/20 text-[#889E81] text-xs font-cormorant rounded">
                      Actual
                    </span>
                  )}
                </div>
                
                <p className={`font-cormorant text-sm mb-1 ${
                  isActive ? 'text-[#6B4423]/80' : 'text-[#6B4423]/50'
                }`}>
                  {event.description}
                </p>
                
                {event.location && (
                  <p className="font-cormorant text-xs text-[#6B4423]/40">
                    📍 {event.location}
                  </p>
                )}
                
                <p className="font-cormorant text-xs text-[#6B4423]/40 mt-2">
                  {formatDate(event.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Próximos pasos (si no está entregado ni cancelado) */}
      {!['DELIVERED', 'CANCELLED'].includes(currentStatus) && (
        <div className="mt-6 pt-6 border-t border-[#6B4423]/10">
          <p className="font-cinzel text-sm text-[#6B4423] mb-4">Próximos pasos</p>
          <div className="flex flex-wrap gap-2">
            {getNextSteps(currentStatus).map((step) => (
              <span 
                key={step}
                className="px-3 py-1 bg-[#F6D3B3]/30 text-[#6B4423]/70 text-sm font-cormorant rounded-full"
              >
                {statusConfig[step]?.label || step}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function generateBasicHistory(currentStatus: string): TrackingEvent[] {
  const currentIndex = statusOrder.indexOf(currentStatus)
  const events: TrackingEvent[] = []
  
  for (let i = 0; i <= currentIndex && i < statusOrder.length; i++) {
    const status = statusOrder[i]
    const config = statusConfig[status]
    
    events.push({
      id: `basic-${i}`,
      status,
      description: config?.label || `Estado: ${status}`,
      createdAt: new Date(Date.now() - (currentIndex - i) * 86400000).toISOString()
    })
  }
  
  return events
}

function getNextSteps(currentStatus: string): string[] {
  const currentIndex = statusOrder.indexOf(currentStatus)
  return statusOrder.slice(currentIndex + 1)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
