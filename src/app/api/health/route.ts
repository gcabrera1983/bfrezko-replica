import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results = {
    database_url_exists: !!process.env.DATABASE_URL,
    database_url_preview: process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ':***@') 
      : 'NO CONFIGURADA',
    prisma_test: 'pending',
    prisma_error: null as string | null,
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    results.prisma_test = 'ok'
  } catch (err: any) {
    results.prisma_test = 'failed'
    results.prisma_error = err.message || String(err)
  }

  return NextResponse.json(results)
}
