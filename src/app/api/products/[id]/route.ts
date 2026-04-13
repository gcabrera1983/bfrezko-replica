import { NextRequest, NextResponse } from 'next/server'
import { products as demoProducts } from '@/data/products'

const DEMO_MODE = !process.env.DATABASE_URL

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Modo demo
    if (DEMO_MODE) {
      const product = demoProducts.find(p => p.id === id)
      
      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json(product)
    }

    // Modo producción
    const { prisma } = await import('@/lib/prisma')
    
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error al cargar producto' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (DEMO_MODE) {
      return NextResponse.json(
        { error: 'Modo demo: no se pueden actualizar productos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { prisma } = await import('@/lib/prisma')

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        image: body.image,
        images: body.images,
        category: body.category,
        tags: body.tags,
        sizes: body.sizes,
        colors: body.colors,
        inStock: body.inStock,
        isNew: body.isNew,
        isBestseller: body.isBestseller
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (DEMO_MODE) {
      return NextResponse.json(
        { error: 'Modo demo: no se pueden eliminar productos' },
        { status: 403 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
