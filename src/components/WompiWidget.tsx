'use client'

import { useEffect, useRef } from 'react'

interface WompiWidgetProps {
  amount: number
  reference: string
  customerEmail: string
  customerName?: string
  publicKey: string
  onSuccess?: (transaction: any) => void
  onError?: (error: any) => void
  sandbox?: boolean
}

declare global {
  interface Window {
    Wompi: any
  }
}

export default function WompiWidget({
  amount,
  reference,
  customerEmail,
  customerName,
  publicKey,
  onSuccess,
  onError,
  sandbox = true
}: WompiWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetInitialized = useRef(false)

  useEffect(() => {
    // Evitar inicialización múltiple
    if (widgetInitialized.current) return
    widgetInitialized.current = true

    // Cargar script de Wompi
    const script = document.createElement('script')
    script.src = sandbox 
      ? 'https://sandbox.wompi.sv/js/wompi.js'
      : 'https://api.wompi.sv/js/wompi.js'
    script.async = true

    script.onload = () => {
      if (window.Wompi && widgetRef.current) {
        const widget = new window.Wompi.Checkout({
          publicKey,
          amount: Math.round(amount * 100), // Centavos
          currency: 'GTQ',
          reference,
          customerEmail,
          customerName,
          onSuccess: (transaction: any) => {
            console.log('Wompi payment success:', transaction)
            onSuccess?.(transaction)
          },
          onError: (error: any) => {
            console.error('Wompi payment error:', error)
            onError?.(error)
          }
        })

        widget.render(widgetRef.current)
      }
    }

    document.body.appendChild(script)

    return () => {
      // Limpiar script al desmontar
      const scripts = document.querySelectorAll('script[src*="wompi"]')
      scripts.forEach(s => s.remove())
    }
  }, [amount, reference, customerEmail, customerName, publicKey, onSuccess, onError, sandbox])

  return (
    <div 
      ref={widgetRef} 
      className="w-full min-h-[400px] flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin mx-auto mb-2"></div>
        <p className="font-cormorant text-[#6B4423]">Cargando pasarela de pago...</p>
      </div>
    </div>
  )
}
