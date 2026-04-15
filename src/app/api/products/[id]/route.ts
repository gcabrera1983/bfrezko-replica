import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as demoProducts } from '@/data/products'
import { serializeProduct } from '@/lib/serialize'

// GET /api/products/[id] - Obtener producto
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    
    try {
      const product = await prisma.product.findUnique({ where: { id } })
      if (product) return NextResponse.json(serializeProduct(product))
    } catch {
      // fallback
    }
    
    const demoProduct = demoProducts.find(p => p.id === id)
    if (demoProduct) return NextResponse.json(demoProduct)
    
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar producto' }, { status: 500 })
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    const body = await request.json()
    
    console.log('[API PUT /products/' + id + '] Body recibido:', JSON.stringify(body, null, 2))

    try {
      const product = await prisma.product.update({
        where: { id },
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
      console.log('[API PUT /products/' + id + '] Producto actualizado en DB:', product.name)
      return NextResponse.json(serializeProduct(product))
    } catch (dbError: any) {
      console.error('[API PUT /products/' + id + '] Error DB:', dbError.message)
      // fallback en memoria
      const demoProduct = demoProducts.find(p => p.id === id)
      if (demoProduct) {
        const updated = { ...demoProduct, ...body, id }
        return NextResponse.json(updated)
      }
      return NextResponse.json({ ...body, id }, { status: 200 })
    }
  } catch (error: any) {
    console.error('[API PUT /products/' + id + '] Error general:', error.message)
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string
    try {
      await prisma.product.delete({ where: { id } })
    } catch {}
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
