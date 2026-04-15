import { NextRequest, NextResponse } from 'next/server'

// GET /api/products/[id] - Obtener producto
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    
    // Por ahora retornar error 404 - se implementará con base de datos
    return NextResponse.json(
      { error: 'Producto no encontrado', id },
      { status: 404 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cargar producto' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  return NextResponse.json(
    { error: 'No implementado' },
    { status: 501 }
  )
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  return NextResponse.json(
    { error: 'No implementado' },
    { status: 501 }
  )
}
