import { NextRequest, NextResponse } from 'next/server'

const DEMO_MODE = !process.env.DATABASE_URL

// POST /api/webhooks/wompi - Recibir notificaciones de Wompi
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    console.log('Wompi webhook received:', payload)

    const { event, data } = payload

    if (!data || !data.transaction) {
      return NextResponse.json(
        { error: 'Payload inválido' },
        { status: 400 }
      )
    }

    const transaction = data.transaction
    const reference = transaction.reference
    
    // Extraer orderId de la referencia (formato: ORDER-{id}-{timestamp})
    const orderIdMatch = reference.match(/ORDER-(.+?)-\d+/)
    if (!orderIdMatch) {
      return NextResponse.json(
        { error: 'Referencia inválida' },
        { status: 400 }
      )
    }
    
    const orderId = orderIdMatch[1]

    // Mapear estado de Wompi a nuestro enum
    const wompiStatus = transaction.status
    let paymentStatus: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' = 'PENDING'
    let orderStatus: 'PENDING' | 'PAID' | 'CANCELLED' = 'PENDING'

    switch (wompiStatus) {
      case 'APPROVED':
      case 'APPROVED_PARTIAL':
        paymentStatus = 'APPROVED'
        orderStatus = 'PAID'
        break
      case 'DECLINED':
      case 'REJECTED':
        paymentStatus = 'DECLINED'
        orderStatus = 'CANCELLED'
        break
      case 'ERROR':
        paymentStatus = 'ERROR'
        break
      default:
        paymentStatus = 'PENDING'
    }

    // Modo demo: solo loggear
    if (DEMO_MODE) {
      console.log('Modo demo: Webhook recibido', {
        orderId,
        paymentStatus,
        orderStatus
      })
      return NextResponse.json({ received: true, demo: true })
    }

    // Modo producción: actualizar orden en base de datos
    const { prisma } = await import('@/lib/prisma')
    
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status: orderStatus,
        paidAt: paymentStatus === 'APPROVED' ? new Date() : null
      }
    })

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}

// GET - Para verificar que el endpoint existe (útil para debug)
export async function GET() {
  return NextResponse.json({ 
    message: 'Wompi webhook endpoint',
    status: 'active',
    demo: DEMO_MODE
  })
}
