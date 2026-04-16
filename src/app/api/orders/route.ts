import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOrders, serializeOrder } from '@/lib/serialize'
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/lib/email'

let fallbackOrders: any[] = []

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/orders - Listar órdenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (hasDatabase) {
      try {
        const where: any = {}
        if (email) where.customerEmail = email
        const orders = await prisma.order.findMany({
          where,
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(serializeOrders(orders))
      } catch (dbError: any) {
        console.error('[API GET /orders] DB Error:', dbError.message)
        return NextResponse.json(
          { error: 'Error al consultar la base de datos' },
          { status: 500 }
        )
      }
    }

    // fallback sin DB
    if (email) return NextResponse.json(fallbackOrders.filter(o => o.customerEmail === email))
    return NextResponse.json(fallbackOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar órdenes' }, { status: 500 })
  }
}

// POST /api/orders - Crear orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (hasDatabase) {
      try {
        // Validaciones básicas del body
        if (!Array.isArray(body.items) || body.items.length === 0) {
          return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 })
        }

        // Verificar que los productos existan para evitar errores de foreign key
        const productIds = body.items.map((item: any) => item.productId).filter(Boolean)
        const existingProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true }
        })
        const existingIds = new Set(existingProducts.map(p => p.id))
        const missingIds = productIds.filter((id: string) => !existingIds.has(id))
        
        if (missingIds.length > 0) {
          console.error('[API POST /orders] Productos no encontrados en DB:', missingIds)
          return NextResponse.json(
            { error: `Productos no válidos en el carrito: ${missingIds.join(', ')}. Vacía el carrito y vuelve a agregarlos desde la tienda.` },
            { status: 400 }
          )
        }

        const order = await prisma.order.create({
          data: {
            total: Number(body.total),
            shippingCost: Number(body.shippingCost || 0),
            customerEmail: body.customer.email,
            customerName: `${body.customer.firstName} ${body.customer.lastName}`,
            customerPhone: body.customer.phone,
            address: body.shipping.address,
            city: body.shipping.city,
            department: body.shipping.department,
            postalCode: body.shipping.postalCode,
            items: {
              create: body.items.map((item: any) => ({
                quantity: Number(item.quantity),
                price: Number(item.price),
                size: item.size,
                color: item.color,
                productId: item.productId
              }))
            },
            trackingHistory: {
              create: {
                status: 'PENDING',
                description: 'Orden recibida - Pago contra entrega',
                location: 'Tienda Online',
                createdBy: 'system'
              }
            }
          },
          include: { items: { include: { product: true } }, trackingHistory: true }
        })

        // Enviar emails en paralelo (no bloqueante)
        const orderWithItems = serializeOrder(order);
        Promise.all([
          sendOrderConfirmationEmail(orderWithItems),
          sendNewOrderAdminEmail(orderWithItems)
        ]).catch(err => console.error('[API Orders] Error enviando emails:', err));

        return NextResponse.json(orderWithItems, { status: 201 })
      } catch (dbError: any) {
        console.error('[API POST /orders] DB Error:', dbError?.message || dbError)
        console.error('[API POST /orders] DB Error details:', dbError?.meta || '')
        // Devolver mensaje útil al cliente
        const message = dbError?.message || 'Error al guardar la orden en la base de datos. Intenta de nuevo.'
        return NextResponse.json(
          { error: message },
          { status: 500 }
        )
      }
    }

    // fallback sin DB
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
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 })
  }
}
