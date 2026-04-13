import { NextRequest, NextResponse } from 'next/server'

const DEMO_MODE = !process.env.DATABASE_URL

// Helper para localStorage en servidor (simulado con variable global)
let demoOrders: any[] = []

// GET /api/orders - Listar órdenes
export async function GET(request: NextRequest) {
  try {
    // En modo demo, devolver órdenes de memoria
    if (DEMO_MODE) {
      return NextResponse.json(demoOrders)
    }

    // Modo producción con Prisma
    const { prisma } = await import('@/lib/prisma')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json([])
  }
}

// POST /api/orders - Crear orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customer,
      shipping,
      total,
      shippingCost
    } = body

    if (!items?.length || !customer?.email || !shipping?.address) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const order = {
      id: 'ORD-' + Date.now(),
      status: 'PENDING',
      total,
      shippingCost,
      customerEmail: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerPhone: customer.phone,
      address: shipping.address,
      city: shipping.city,
      department: shipping.department,
      postalCode: shipping.postalCode,
      paymentStatus: 'PENDING',
      items: items.map((item: any, i: number) => ({
        id: `item-${i}`,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        productId: item.productId,
        product: {
          id: item.productId,
          name: item.name,
          image: item.image || ''
        }
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // En modo demo, guardar en memoria
    if (DEMO_MODE) {
      demoOrders.unshift(order)
      return NextResponse.json(order, { status: 201 })
    }

    // Modo producción
    const { prisma } = await import('@/lib/prisma')

    const createdOrder = await prisma.order.create({
      data: {
        total,
        shippingCost,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
        address: shipping.address,
        city: shipping.city,
        department: shipping.department,
        postalCode: shipping.postalCode,
        items: {
          create: items.map((item: any) => ({
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

    return NextResponse.json(createdOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
