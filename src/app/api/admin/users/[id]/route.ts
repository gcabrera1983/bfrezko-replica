import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id as string

    const adminCount = await prisma.admin.count({
      where: { role: 'ADMIN' }
    })

    const userToDelete = await prisma.admin.findUnique({
      where: { id }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (userToDelete.role === 'ADMIN' && adminCount <= 1) {
      return NextResponse.json(
        { error: 'No puedes eliminar el último administrador' },
        { status: 403 }
      )
    }

    await prisma.admin.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API DELETE /admin/users/' + params.id + '] Error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}
