import { NextRequest, NextResponse } from 'next/server'

const WOMPI_API_URL = process.env.WOMPI_API_URL || 'https://sandbox.wompi.sv'
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY
const DEMO_MODE = !process.env.DATABASE_URL && !WOMPI_PRIVATE_KEY

// POST /api/checkout/wompi - Iniciar transacción de pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, customerEmail, customerName, redirectUrl } = body

    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Crear referencia única para la transacción
    const reference = `ORDER-${orderId}-${Date.now()}`

    // Modo demo: simular respuesta de Wompi
    if (DEMO_MODE) {
      return NextResponse.json({
        transactionId: `demo_${Date.now()}`,
        reference: reference,
        amount: amount,
        currency: 'GTQ',
        status: 'PENDING',
        checkoutUrl: `/checkout/payment?orderId=${orderId}&reference=${reference}`,
        sandbox: true
      })
    }

    // Datos de la transacción para Wompi
    const transactionData = {
      amount: Math.round(amount * 100), // Wompi espera centavos
      currency: 'GTQ',
      reference: reference,
      customer_email: customerEmail,
      customer_name: customerName,
      redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/wompi`
    }

    // Llamada real a la API de Wompi
    const response = await fetch(`${WOMPI_API_URL}/v1/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Wompi API error:', error)
      return NextResponse.json(
        { error: 'Error al procesar pago con Wompi' },
        { status: 500 }
      )
    }

    const wompiData = await response.json()

    // Guardar el ID de transacción en la orden
    const { prisma } = await import('@/lib/prisma')
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: wompiData.data.id,
        paymentStatus: 'PROCESSING'
      }
    })

    return NextResponse.json({
      transactionId: wompiData.data.id,
      reference: reference,
      amount: amount,
      currency: 'GTQ',
      status: 'PROCESSING',
      checkoutUrl: wompiData.data.checkout_url || wompiData.data.redirect_url,
      sandbox: WOMPI_API_URL.includes('sandbox')
    })

  } catch (error) {
    console.error('Error creating Wompi transaction:', error)
    return NextResponse.json(
      { error: 'Error al iniciar pago' },
      { status: 500 }
    )
  }
}

// GET /api/checkout/wompi/verify - Verificar estado de transacción
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID de transacción requerido' },
        { status: 400 }
      )
    }

    // Modo demo: simular pago aprobado
    if (DEMO_MODE) {
      return NextResponse.json({
        id: transactionId,
        status: 'APPROVED',
        amount: 0,
        currency: 'GTQ'
      })
    }

    // Verificar con Wompi
    const response = await fetch(`${WOMPI_API_URL}/v1/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    const data = await response.json()

    return NextResponse.json(data.data)

  } catch (error) {
    console.error('Error verifying transaction:', error)
    return NextResponse.json(
      { error: 'Error al verificar pago' },
      { status: 500 }
    )
  }
}
