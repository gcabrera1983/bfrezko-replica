import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.admin.findUnique({
    where: { email: 'admin@agape.studio' }
  })

  if (existing) {
    console.log('Admin ya existe:', existing.email)
    await prisma.$disconnect()
    return
  }

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@agape.studio',
      password: 'agape2024',
      name: 'Administrador',
      role: 'ADMIN',
      isActive: true,
    }
  })

  console.log('Admin creado:', admin.email)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
