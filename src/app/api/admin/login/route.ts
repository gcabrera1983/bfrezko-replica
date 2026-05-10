import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fallback credentials (para cuando la DB aún no está actualizada)
const FALLBACK_ADMIN = {
  id: 'fallback-admin-id',
  email: 'admin@agape.studio',
  password: 'agape2024',
  name: 'Administrador',
  role: 'ADMIN',
  isActive: true,
  lastLogin: null,
  createdAt: new Date().toISOString(),
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Intentar login contra la base de datos
    try {
      const admin = await prisma.admin.findUnique({
        where: { email }
      })

      if (admin && admin.password === password) {
        if (!admin.isActive) {
          return NextResponse.json(
            { error: 'Usuario inactivo' },
            { status: 403 }
          )
        }

        try {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() }
          })
        } catch {}

        const { password: _, ...user } = admin as any
        return NextResponse.json(user)
      }
    } catch (dbError: any) {
      console.log('[Login] DB no disponible o schema desactualizado, usando fallback')
    }

    // Fallback hardcoded
    const normalizedEmail = email.toLowerCase().trim()
    if (
      (normalizedEmail === 'admin' || normalizedEmail === 'admin@agape.studio') &&
      password === FALLBACK_ADMIN.password
    ) {
      const { password: _, ...user } = FALLBACK_ADMIN
      return NextResponse.json(user)
    }

    return NextResponse.json(
      { error: 'Credenciales incorrectas' },
      { status: 401 }
    )
  } catch (error) {
    console.error('[API POST /admin/login] Error:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
