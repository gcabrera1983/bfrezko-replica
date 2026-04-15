import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders - Listar órdenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const where: any = {}
    if (email) {
      where.customerEmail = email
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al cargar órdenes' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Crear orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
