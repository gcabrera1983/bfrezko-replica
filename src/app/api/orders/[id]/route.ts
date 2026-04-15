import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOrder } from '@/lib/serialize'

// GET /api/orders/[id] - Obtener orden
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
      })
      if (order) return NextResponse.json(serializeOrder(order))
    } catch {}
    
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
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
      const order = await prisma.order.update({
        where: { id },
        data: {
          status: body.status,
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
          shippedAt: body.shippedAt ? new Date(body.shippedAt) : undefined,
          deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined
        },
        include: { items: { include: { product: true } } }
      })
      return NextResponse.json(serializeOrder(order))
    } catch {
      return NextResponse.json({ ...body, id })
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
