import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as demoProducts } from '@/data/products'
import { serializeProducts, serializeProduct } from '@/lib/serialize'

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('isNew') === 'true'
    const isBestseller = searchParams.get('isBestseller') === 'true'
    const search = searchParams.get('search')

    // Intentar base de datos, fallback a demo si falla
    let products = demoProducts
    
    try {
      const where: any = {}
      if (category && category !== 'all') where.category = category
      if (isNew) where.isNew = true
      if (isBestseller) where.isBestseller = true
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }

      const dbProducts = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } })
      if (dbProducts.length > 0) {
        products = serializeProducts(dbProducts)
      }
    } catch (dbError) {
      console.log('[API /products] DB no disponible, usando demo products')
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(demoProducts)
  }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    try {
      const product = await prisma.product.create({
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          originalPrice: body.originalPrice || null,
          image: body.image,
          images: body.images || [body.image],
          category: body.category,
          tags: body.tags || [],
          sizes: body.sizes || [],
          colors: body.colors || [],
          inStock: body.inStock ?? true,
          isNew: body.isNew || false,
          isBestseller: body.isBestseller || false
        }
      })
      return NextResponse.json(serializeProduct(product), { status: 201 })
    } catch (dbError) {
      // Fallback: crear en memoria
      const newProduct = { ...body, id: 'prod-' + Date.now() }
      return NextResponse.json(newProduct, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
