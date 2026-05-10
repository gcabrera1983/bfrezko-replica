import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    emailConfigured: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || null,
    adminEmail: process.env.ADMIN_EMAIL || null,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  })
}
