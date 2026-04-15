import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOrder } from '@/lib/serialize'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, trackingHistory: { orderBy: { createdAt: 'asc' } } }
    })

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    const serialized = serializeOrder(order)
    const lastNote = order.trackingHistory?.length
      ? order.trackingHistory[order.trackingHistory.length - 1].description
      : undefined

    await sendOrderStatusUpdateEmail(serialized, lastNote || undefined)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API Notify] Error:', error.message)
    return NextResponse.json({ error: 'Error al enviar notificación' }, { status: 500 })
  }
}
