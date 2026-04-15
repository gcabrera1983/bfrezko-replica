import { NextRequest, NextResponse } from 'next/server'
import { products as demoProducts } from '@/data/products'

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('isNew') === 'true'
    const isBestseller = searchParams.get('isBestseller') === 'true'
    const search = searchParams.get('search')

    let filtered = [...demoProducts]

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }
    if (isNew) {
      filtered = filtered.filter(p => p.isNew)
    }
    if (isBestseller) {
      filtered = filtered.filter(p => p.isBestseller)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filtered)
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
    
    // Crear producto con ID único
    const newProduct = {
      ...body,
      id: 'prod-' + Date.now()
    }

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
