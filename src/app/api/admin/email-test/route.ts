import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to } = body

    // 1. Verificar si RESEND_API_KEY existe
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY no está configurada en las variables de entorno',
        step: 'missing_api_key'
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

    // 2. Enviar email de prueba
    const { data, error } = await resend.emails.send({
      from: `Ágape Studio <${fromEmail}>`,
      to: to || 'test@example.com',
      subject: '📧 Prueba de configuración de email',
      html: `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;color:#4a3b2a;background:#FDF9F3;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5d4c3;border-radius:8px;padding:24px;">
    <h2 style="color:#6B4423;">¡Configuración correcta!</h2>
    <p>Si estás leyendo esto, los emails de Ágape Studio están funcionando correctamente.</p>
    <p><strong>Remitente configurado:</strong> ${fromEmail}</p>
    <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY?.slice(0, 8)}... ✓</p>
  </div>
</body>
</html>`
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        step: 'send_failed',
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      from: fromEmail,
      to: to || 'test@example.com'
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Error desconocido',
      step: 'exception'
    }, { status: 500 })
  }
}
