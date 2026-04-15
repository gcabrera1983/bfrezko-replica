import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOrders, serializeOrder } from '@/lib/serialize'

let fallbackOrders: any[] = []

// GET /api/orders - Listar órdenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    try {
      const where: any = {}
      if (email) where.customerEmail = email
      const orders = await prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      })
      if (orders.length > 0 || process.env.DATABASE_URL) {
        return NextResponse.json(serializeOrders(orders))
      }
    } catch {}

    // fallback
    if (email) return NextResponse.json(fallbackOrders.filter(o => o.customerEmail === email))
    return NextResponse.json(fallbackOrders)
  } catch (error) {
    return NextResponse.json(fallbackOrders)
  }
}

// POST /api/orders - Crear orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    try {
      const order = await prisma.order.create({
        data: {
          total: body.total,
          shippingCost: body.shippingCost || 0,
          customerEmail: body.customer.email,
          customerName: `${body.customer.firstName} ${body.customer.lastName}`,
          customerPhone: body.customer.phone,
          address: body.shipping.address,
          city: body.shipping.city,
          department: body.shipping.department,
          postalCode: body.shipping.postalCode,
          items: {
            create: body.items.map((item: any) => ({
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color,
              productId: item.productId
            }))
          }
        },
        include: { items: { include: { product: true } } }
      })
      return NextResponse.json(serializeOrder(order), { status: 201 })
    } catch {
      const order = {
        id: 'ORD-' + Date.now(),
        status: 'PENDING',
        total: body.total,
        shippingCost: body.shippingCost || 0,
        customerEmail: body.customer.email,
        customerName: `${body.customer.firstName} ${body.customer.lastName}`,
        customerPhone: body.customer.phone,
        address: body.shipping.address,
        city: body.shipping.city,
        department: body.shipping.department,
        postalCode: body.shipping.postalCode,
        paymentStatus: 'PENDING',
        items: body.items.map((item: any, i: number) => ({
          id: `item-${i}`,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          productId: item.productId,
          product: { id: item.productId, name: item.name, image: item.image || '' }
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      fallbackOrders.unshift(order)
      return NextResponse.json(order, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 })
  }
}
