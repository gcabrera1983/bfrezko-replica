import { NextRequest, NextResponse } from 'next/server'

// Almacenamiento en memoria para órdenes
let orders: any[] = []

// GET /api/orders - Listar órdenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
      return NextResponse.json(orders.filter(o => o.customerEmail === email))
    }

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
        product: {
          id: item.productId,
          name: item.name,
          image: item.image || ''
        }
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.unshift(order)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
