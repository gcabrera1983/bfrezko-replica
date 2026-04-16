import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOrder } from '@/lib/serialize'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

// GET /api/orders/[id] - Obtener orden por ID completo o número corto (últimos 8 chars)
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const rawId = params.id as string
    const cleanId = rawId.replace('#', '').trim().toLowerCase()
    
    try {
      // Primero intentar búsqueda exacta por ID completo
      let order = await prisma.order.findUnique({
        where: { id: cleanId },
        include: { items: { include: { product: true } }, trackingHistory: { orderBy: { createdAt: 'asc' } } }
      })

      // Si no se encuentra, buscar por los últimos 8 caracteres del ID (número de orden visible)
      if (!order && cleanId.length >= 4) {
        const candidates = await prisma.order.findMany({
          where: {
            id: {
              endsWith: cleanId,
              mode: 'insensitive'
            }
          },
          include: { items: { include: { product: true } }, trackingHistory: { orderBy: { createdAt: 'asc' } } },
          orderBy: { createdAt: 'desc' },
          take: 1
        })
        order = candidates[0] || null
      }

      if (order) return NextResponse.json(serializeOrder(order))
    } catch (err: any) {
      console.error('[API GET /orders/' + cleanId + '] Error:', err.message)
    }
    
    return NextResponse.json({ error: 'Orden no encontrada. Verifica el número de orden.' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar orden' }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Actualizar orden
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    const body = await request.json()

    try {
      // Obtener orden actual para comparar estado previo
      const existingOrder = await prisma.order.findUnique({
        where: { id },
        select: { status: true }
      })

      if (!existingOrder) {
        return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
      }

      // Actualizar orden
      const data: any = {
        status: body.status,
        trackingNumber: body.trackingNumber,
        carrier: body.carrier,
      }

      // Auto-set shippedAt / deliveredAt basado en status
      if (body.status === 'SHIPPED' && !body.shippedAt) {
        data.shippedAt = new Date()
      }
      if (body.status === 'DELIVERED' && !body.deliveredAt) {
        data.deliveredAt = new Date()
      }
      if (body.shippedAt) data.shippedAt = new Date(body.shippedAt)
      if (body.deliveredAt) data.deliveredAt = new Date(body.deliveredAt)

      await prisma.order.update({
        where: { id },
        data,
      })

      // Siempre crear entrada en historial de tracking cuando cambia el estado
      // o cuando hay nota manual del admin
      const statusChanged = existingOrder.status !== body.status
      if (statusChanged || body.note) {
        const defaultDescriptions: Record<string, string> = {
          PENDING: 'Orden recibida',
          PAID: 'Pago confirmado',
          PROCESSING: 'Pedido en preparación',
          READY: 'Pedido listo para envío',
          SHIPPED: body.trackingNumber
            ? `Pedido enviado. Guía: ${body.trackingNumber}`
            : 'Pedido enviado',
          IN_TRANSIT: 'Pedido en tránsito',
          OUT_FOR_DELIVERY: 'Pedido en reparto',
          DELIVERED: 'Pedido entregado',
          CANCELLED: 'Pedido cancelado',
        }

        await prisma.orderTracking.create({
          data: {
            orderId: id,
            status: body.status,
            description: body.note || defaultDescriptions[body.status] || `Estado actualizado a ${body.status}`,
            location: body.location || 'Bodega Ágape',
            createdBy: 'admin'
          }
        })
      }

      // Recargar orden con tracking actualizado
      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } }, trackingHistory: { orderBy: { createdAt: 'asc' } } }
      })

      const serialized = serializeOrder(updatedOrder!)

      // Enviar email de actualización al cliente (no bloqueante)
      sendOrderStatusUpdateEmail(serialized, body.note).catch(err => {
        console.error('[API Orders] Error enviando email de actualización:', err)
      })

      return NextResponse.json(serialized)
    } catch (err: any) {
      console.error('[API PUT /orders/' + id + '] Error:', err.message)
      return NextResponse.json({ error: 'Error al actualizar orden en base de datos' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 })
  }
}

// DELETE /api/orders/[id] - Eliminar orden
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    try { await prisma.order.delete({ where: { id } }) } catch {}
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar orden' }, { status: 500 })
  }
}
