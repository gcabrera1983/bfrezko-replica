import { NextRequest, NextResponse } from 'next/server'

const DEMO_MODE = !process.env.DATABASE_URL
let demoOrders: any[] = []

// GET /api/orders/[id] - Obtener orden
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (DEMO_MODE) {
      const order = demoOrders.find(o => o.id === id)
      
      if (!order) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json(order)
    }

    const { prisma } = await import('@/lib/prisma')
    
    const order = await prisma.order.findUnique({
      where: { id },
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
        },
        trackingHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Error al cargar orden' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Actualizar orden
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, trackingNumber, carrier, note, location } = body

    if (DEMO_MODE) {
      const index = demoOrders.findIndex(o => o.id === params.id)
      if (index === -1) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        )
      }

      // Actualizar orden
      demoOrders[index] = {
        ...demoOrders[index],
        status: status || demoOrders[index].status,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : demoOrders[index].trackingNumber,
        carrier: carrier !== undefined ? carrier : demoOrders[index].carrier,
        updatedAt: new Date().toISOString()
      }

      // Agregar al historial de tracking si hay nota
      if (note || status) {
        if (!demoOrders[index].trackingHistory) {
          demoOrders[index].trackingHistory = []
        }
        demoOrders[index].trackingHistory.push({
          id: 'track-' + Date.now(),
          status: status || demoOrders[index].status,
          description: note || `Estado actualizado a: ${status}`,
          location: location || 'Sistema',
          createdAt: new Date().toISOString()
        })
      }

      return NextResponse.json(demoOrders[index])
    }

    const { prisma } = await import('@/lib/prisma')

    const updateData: any = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (carrier !== undefined) updateData.carrier = carrier

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData
    })

    if (status && note) {
      await prisma.orderTracking.create({
        data: {
          status,
          description: note,
          location,
          orderId: params.id,
          createdBy: 'admin'
        }
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    )
  }
}
