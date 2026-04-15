import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('[API Upload] Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    console.log('[API Upload] API Key exists:', !!process.env.CLOUDINARY_API_KEY)
    console.log('[API Upload] API Secret exists:', !!process.env.CLOUDINARY_API_SECRET)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    console.log('[API Upload] Archivo recibido:', file.name, file.type, file.size)

    // Verificar configuración
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary no configurado. Faltan variables de entorno.' },
        { status: 500 }
      )
    }

    // Convertir archivo a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    console.log('[API Upload] Subiendo a Cloudinary...')

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'agape-products',
      resource_type: 'auto',
    })

    console.log('[API Upload] Éxito:', result.secure_url)

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error: any) {
    console.error('[API Upload] Error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
