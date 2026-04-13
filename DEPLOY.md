# 🚀 Guía de Despliegue - Ágape Studio E-commerce

Este documento explica cómo configurar y desplegar tu tienda online con base de datos real y pagos.

---

## 📋 Requisitos Previos

- [ ] Cuenta en [Supabase](https://supabase.com)
- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Cuenta en [Wompi](https://wompi.sv) (BAC Credomatic)
- [ ] Cuenta bancaria en Guatemala (para recibir pagos)

---

## 1️⃣ Configurar Supabase (Base de Datos)

### Crear Proyecto

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Click "New Project"
3. Nombre: `agape-studio`
4. Region: "East US" (más cercano a Guatemala)
5. Plan: Free Tier
6. Espera a que se cree (2-3 minutos)

### Obtener Credenciales

1. Ve a **Project Settings > Database**
2. Copia el "Connection string" (URI)
3. Ve a **Project Settings > API**
4. Copia:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2️⃣ Configurar Base de Datos

### Instalar Prisma CLI

```bash
npx prisma generate
```

### Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
# Supabase
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.TU_REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://TU_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TU_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="TU_SERVICE_KEY"

# Wompi (Sandbox para pruebas)
WOMPI_PUBLIC_KEY="pub_test_..."
WOMPI_PRIVATE_KEY="prv_test_..."
WOMPI_API_URL="https://sandbox.wompi.sv"
WOMPI_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"
JWT_SECRET="tu-secreto-jwt-super-seguro-32-caracteres-minimo"
```

### Crear Tablas en Supabase

```bash
# Generar migración
npx prisma migrate dev --name init

# O si ya tienes el schema listo:
npx prisma db push
```

---

## 3️⃣ Configurar Wompi (Pagos)

### Crear Cuenta

1. Ve a [wompi.sv](https://wompi.sv)
2. Regístrate con tu cuenta BAC
3. Completa el proceso de verificación

### Obtener Credenciales (Sandbox)

1. Ve al **Dashboard > Developers > API Keys**
2. Copia las credenciales de **Sandbox**:
   - Public Key → `WOMPI_PUBLIC_KEY`
   - Private Key → `WOMPI_PRIVATE_KEY`

### Configurar Webhook

1. En el dashboard de Wompi, ve a **Webhooks**
2. Agrega endpoint:
   - URL: `https://tu-dominio.vercel.app/api/webhooks/wompi`
   - Eventos: `transaction.updated`, `transaction.created`
3. Copia el **Webhook Secret** → `WOMPI_WEBHOOK_SECRET`

### Activar Producción

Cuando estés listo para recibir pagos reales:

1. Cambia las credenciales a las de **Producción**
2. Actualiza `WOMPI_API_URL` a `https://api.wompi.sv`
3. Verifica que tu cuenta bancaria esté configurada

---

## 4️⃣ Desplegar en Vercel

### Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub/GitLab
3. Framework Preset: "Next.js"

### Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega todas las variables del archivo `.env`.

### Deploy

Click en "Deploy". El build debería completarse sin errores.

---

## 5️⃣ Configurar Dominio Personalizado

### Opción A: Comprar en Vercel

1. Ve a **Settings > Domains**
2. Compra tu dominio (ej: `agapestudio.com`)
3. Vercel configura automáticamente SSL

### Opción B: Usar Dominio Existente

1. Ve a **Settings > Domains**
2. Agrega tu dominio
3. Configura los DNS records que indica Vercel en tu proveedor de dominio

---

## 🔒 Seguridad Importante

### Variables que NUNCA deben ir al cliente:

- ❌ `WOMPI_PRIVATE_KEY` - Solo servidor
- ❌ `DATABASE_URL` - Solo servidor
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Solo servidor
- ❌ `JWT_SECRET` - Solo servidor

### Variables que PUEDEN ir al cliente:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`

---

## 🧪 Probar el Sistema

### 1. Probar Productos

```bash
# Crear producto de prueba
curl -X POST https://tu-dominio.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Playera Test",
    "description": "Descripción de prueba",
    "price": 185.00,
    "image": "https://via.placeholder.com/600",
    "images": ["https://via.placeholder.com/600"],
    "category": "Colección Principal",
    "tags": ["nuevo"],
    "sizes": ["S", "M", "L"],
    "colors": [{"name": "Negro", "value": "#000000"}]
  }'
```

### 2. Probar Checkout (Sandbox)

1. Agrega productos al carrito
2. Ve al checkout
3. Usa estos datos de prueba de Wompi:
   - Tarjeta: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVV: `123`
   - Nombre: Cualquiera

### 3. Verificar Webhook

1. Realiza un pago de prueba
2. Revisa el dashboard de Wompi que el webhook responde 200
3. Verifica en Supabase que la orden se marca como "PAID"

---

## 📊 Costos Mensuales Estimados

| Servicio | Costo |
|----------|-------|
| **Vercel Pro** | $20/mes |
| **Supabase** | $0 (gratis hasta 500MB) |
| **Wompi** | Solo comisión por venta (3.5% + IVA) |
| **Dominio** | $10-15/año |
| **Total fijo** | **$20/mes** |

---

## 🆘 Solución de Problemas

### Error: "Database connection failed"

- Verifica que `DATABASE_URL` esté correcto
- Asegúrate de que la IP de Vercel esté permitida en Supabase:
  - Supabase > Settings > Database > IPv4
  - Desactiva "Enable IP Whitelisting" o agrega la IP de Vercel

### Error: "Wompi payment failed"

- Verifica que las credenciales sean de Sandbox (no producción)
- Revisa que `NEXT_PUBLIC_APP_URL` coincida con tu dominio real

### Error: "Prisma Client not found"

```bash
# Regenerar cliente de Prisma
npx prisma generate

# Hacer commit del cambio y redeploy
git add .
git commit -m "Update prisma client"
git push
```

---

## 📝 Checklist Pre-Launch

- [ ] Dominio configurado correctamente
- [ ] SSL/HTTPS funcionando (certificado válido)
- [ ] Base de datos con productos reales
- [ ] Wompi en modo producción
- [ ] Webhooks funcionando (verificar en dashboard Wompi)
- [ ] Términos y condiciones publicados
- [ ] Política de privacidad publicada
- [ ] Cuenta bancaria verificada en Wompi
- [ ] Email de contacto configurado
- [ ] Probar compra de principio a fin

---

## 🎉 ¡Listo!

Tu tienda online ahora tiene:
- ✅ Base de datos PostgreSQL persistente
- ✅ Procesamiento de pagos con Wompi
- ✅ Panel de admin real
- ✅ SSL y dominio propio
- ✅ Escalable para miles de ventas

¿Preguntas? Revisa la documentación de:
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://prisma.io/docs)
- [Supabase](https://supabase.com/docs)
- [Wompi](https://docs.wompi.sv)
