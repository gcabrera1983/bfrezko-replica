import { NextRequest, NextResponse } from 'next/server'
import { products as demoProducts } from '@/data/products'

// Modo demo: usa productos locales si no hay base de datos
const DEMO_MODE = !process.env.DATABASE_URL

// GET /api/products - Listar todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('isNew')
    const isBestseller = searchParams.get('isBestseller')
    const search = searchParams.get('search')

    // Modo demo: filtrar productos locales
    if (DEMO_MODE) {
      let filtered = [...demoProducts]
      
      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (isNew === 'true') {
        filtered = filtered.filter(p => p.isNew)
      }
      if (isBestseller === 'true') {
        filtered = filtered.filter(p => p.isBestseller)
      }
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(t => t.toLowerCase().includes(searchLower))
        )
      }
      
      return NextResponse.json(filtered)
    }

    // Modo producción: usar Prisma
    const { prisma } = await import('@/lib/prisma')
    
    const where: any = { inStock: true }
    if (category) where.category = category
    if (isNew === 'true') where.isNew = true
    if (isBestseller === 'true') where.isBestseller = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback a productos demo si hay error
    return NextResponse.json(demoProducts)
  }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    if (DEMO_MODE) {
      return NextResponse.json(
        { error: 'Modo demo: no se pueden crear productos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { prisma } = await import('@/lib/prisma')

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        image: body.image,
        images: body.images || [body.image],
        category: body.category,
        tags: body.tags || [],
        sizes: body.sizes,
        colors: body.colors,
        inStock: body.inStock ?? true,
        isNew: body.isNew ?? false,
        isBestseller: body.isBestseller ?? false
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
