import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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
