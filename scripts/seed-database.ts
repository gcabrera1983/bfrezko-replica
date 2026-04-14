// Script para migrar productos de demo a la base de datos
// Ejecutar: npx ts-node scripts/seed-database.ts

import { PrismaClient } from '@prisma/client'
import { products as demoProducts } from '../src/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando migración de productos...')
  
  for (const product of demoProducts) {
    try {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          images: product.images,
          category: product.category,
          tags: product.tags,
          sizes: product.sizes,
          colors: product.colors,
          inStock: product.inStock,
          isNew: product.isNew,
          isBestseller: product.isBestseller
        },
        create: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          images: product.images,
          category: product.category,
          tags: product.tags,
          sizes: product.sizes,
          colors: product.colors,
          inStock: product.inStock,
          isNew: product.isNew,
          isBestseller: product.isBestseller
        }
      })
      console.log(`✅ Producto migrado: ${product.name}`)
    } catch (error) {
      console.error(`❌ Error migrando ${product.name}:`, error)
    }
  }
  
  console.log('🎉 Migración completada!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
