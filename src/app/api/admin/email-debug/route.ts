import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to } = body

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, error: 'RESEND_API_KEY no configurada' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

    const { data, error } = await resend.emails.send({
      from: `Ágape Studio <${fromEmail}>`,
      to: to,
      subject: '📧 Test de diagnóstico - Ágape Studio',
      html: `<p>Este es un email de prueba enviado a: ${to}</p><p>Desde: ${fromEmail}</p>`
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message, details: error })
    }

    return NextResponse.json({ success: true, messageId: data?.id, to, from: fromEmail })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message })
  }
}
