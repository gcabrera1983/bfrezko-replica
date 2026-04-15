import { NextRequest, NextResponse } from 'next/server'

// GET /api/orders/[id] - Obtener orden
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    
    // Por ahora retornar error 404 - se implementará con base de datos
    return NextResponse.json(
      { error: 'Orden no encontrada', id },
      { status: 404 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cargar orden' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Actualizar orden
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  return NextResponse.json(
    { error: 'No implementado' },
    { status: 501 }
  )
}

// DELETE /api/orders/[id] - Eliminar orden
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  return NextResponse.json(
    { error: 'No implementado' },
    { status: 501 }
  )
}
