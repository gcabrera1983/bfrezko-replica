import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as demoProducts } from '@/data/products'

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
  try {
    // Verificar si hay base de datos configurada
    const hasDatabase = !!process.env.DATABASE_URL
    
    if (!hasDatabase) {
      console.log('[API /products] No DATABASE_URL, usando productos demo')
      return NextResponse.json(demoProducts)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('isNew') === 'true'
    const isBestseller = searchParams.get('isBestseller') === 'true'
    const search = searchParams.get('search')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }
    if (isNew) {
      where.isNew = true
    }
    if (isBestseller) {
      where.isBestseller = true
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    console.log('[API /products] Productos desde DB:', products.length)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback a productos demo si la base de datos falla
    return NextResponse.json(demoProducts)
  }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    const hasDatabase = !!process.env.DATABASE_URL
    const body = await request.json()
    
    if (!hasDatabase) {
      const newProduct = {
        ...body,
        id: 'prod-' + Date.now()
      }
      return NextResponse.json(newProduct, { status: 201 })
    }
    
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
