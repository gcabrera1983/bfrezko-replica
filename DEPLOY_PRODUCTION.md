# 🚀 Deploy a Producción - Ágape Studio

## Botón Deploy (Automático)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gcabrera1983/bfrezko-replica&project-name=agape-studio&repository-name=agape-studio)

---

## 📋 Paso a Paso para Producción

### PASO 1: Prepara tu código en GitHub

```bash
# En tu terminal
cd /Users/sergiocabrera/Desktop/kimi/marketin/bfrezko-replica

# Asegúrate que todo esté commitado
git add .
git commit -m "Preparado para producción"
git push origin main
```

### PASO 2: Crear Proyecto en Supabase

Ve a [supabase.com](https://supabase.com):

```
┌─────────────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [+ New Project]                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Create a new project                                   │   │
│  │                                                         │   │
│  │  Organization:      your-org                   ▼       │   │
│  │                                                         │   │
│  │  Project name:      agape-studio                        │   │
│  │  * El nombre de tu proyecto                             │   │
│  │                                                         │   │
│  │  Database Password: [********************]    [Generate]│   │
│  │  * Secure your database with a password                 │   │
│  │                                                         │   │
│  │  Region:            East US (N. Virginia)      ▼       │   │
│  │  * Choose a region close to your users                  │   │
│  │                                                         │   │
│  │                         [Create new project]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Espera 2-3 minutos a que se cree.

### PASO 3: Obtener Credenciales de Supabase

```
┌─────────────────────────────────────────────────────────────────┐
│  Project Settings > API                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Project API keys                                               │
│  ───────────────────                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  URL                                                    │   │
│  │  https://xxxxxxxxxxxxxx.supabase.co                     │   │
│  │                                    [📋 Copy]            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  anon public                                            │   │
│  │  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...               │   │
│  │                                    [📋 Copy]            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  service_role secret  (⚠️ NO COMPARTIR)                 │   │
│  │  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...               │   │
│  │                                    [📋 Copy]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Project Settings > Database                                    │
│  ─────────────────────────────────                              │
│                                                                 │
│  Connection string:                                             │
│  postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Guarda estos valores**, los necesitarás en Vercel.

### PASO 4: Crear Tablas en Supabase

En el SQL Editor de Supabase, ejecuta:

```sql
-- Tabla de Productos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Órdenes
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'PENDING',
  payment_status TEXT DEFAULT 'PENDING',
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT,
  postal_code TEXT,
  items JSONB NOT NULL,
  wompi_transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Políticas de seguridad (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
```

### PASO 5: Crear Cuenta en Wompi (Pagos)

Ve a [wompi.sv](https://wompi.sv):

```
┌─────────────────────────────────────────────────────────────────┐
│  Wompi Dashboard                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Regístrate con tu cuenta BAC Credomatic                     │
│  2. Completa verificación de identidad                          │
│  3. Espera aprobación (puede tomar 1-2 días)                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Developers > API Keys                                  │   │
│  │                                                         │   │
│  │  🧪 Sandbox (Para pruebas):                             │   │
│  │     Public Key:  pub_test_xxxxxxxxxx                    │   │
│  │     Private Key: prv_test_xxxxxxxxxx                    │   │
│  │                                                         │   │
│  │  💰 Producción (Pagos reales):                          │   │
│  │     Public Key:  pub_prod_xxxxxxxxxx                    │   │
│  │     Private Key: prv_prod_xxxxxxxxxx                    │   │
│  │                                                         │   │
│  │  Webhooks > Add Endpoint:                               │   │
│  │     URL: https://tu-dominio.vercel.app/api/webhooks/wompi│   │
│  │     Events: transaction.updated, transaction.created    │   │
│  │     Secret: whsec_xxxxxxxxxx  ← Guardar este valor      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### PASO 6: Deploy en Vercel

Haz clic en el botón de arriba ↑ o ve a [vercel.com](https://vercel.com):

```
┌─────────────────────────────────────────────────────────────────┐
│  Vercel - Configure Project                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GIT REPOSITORY                                                 │
│  gcabrera1983/bfrezko-replica                            [Edit] │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PROJECT NAME: agape-studio                             │   │
│  │  FRAMEWORK: Next.js                                     │   │
│  │  ROOT DIRECTORY: ./                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ENVIRONMENT VARIABLES  ← IMPORTANTE: Agrega todas estas       │
│  ─────────────────────                                          │
│                                                                 │
│  ┌─────────────────────────────────┬────────────────────────┐  │
│  │ NAME                            │ VALUE                  │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ DATABASE_URL                    │ postgresql://postgr... │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ NEXT_PUBLIC_SUPABASE_URL        │ https://xxxxx.supab... │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ eyJhbGciOiJIUzI1Ni...  │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ SUPABASE_SERVICE_ROLE_KEY       │ eyJhbGciOiJIUzI1Ni...  │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ WOMPI_PUBLIC_KEY                │ pub_test_xxxxxxxxxxx   │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ WOMPI_PRIVATE_KEY               │ prv_test_xxxxxxxxxxx   │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ WOMPI_API_URL                   │ https://sandbox.wompi.sv│  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ WOMPI_WEBHOOK_SECRET            │ whsec_xxxxxxxxxxxx     │  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ NEXT_PUBLIC_APP_URL             │ https://agape-studio.vercel.app│  │
│  ├─────────────────────────────────┼────────────────────────┤  │
│  │ JWT_SECRET                      │ minimo-32-caracteres-seguros   │  │
│  └─────────────────────────────────┴────────────────────────┘  │
│                                                                 │
│                      [Deploy →]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Haz clic en **Deploy** y espera 2-3 minutos.

### PASO 7: Dominio Personalizado (Opcional)

```
┌─────────────────────────────────────────────────────────────────┐
│  Project Settings > Domains                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Production Domains                                             │
│  ───────────────────                                            │
│  🌐 agape-studio.vercel.app                    ✅ Valid         │
│                                                                 │
│  Add Custom Domain                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Enter your domain: www.agapestudio.com    [+ Add]       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  DNS Configuration:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type    │ Name           │ Value                        │   │
│  │ A       │ @              │ 76.76.21.21                 │   │
│  │ CNAME   │ www            │ cname.vercel-dns.com         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Configura estos registros en tu proveedor de dominio (GoDaddy, │
│  Namecheap, Cloudflare, etc.)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### PASO 8: Probar Todo

```bash
# 1. Crear producto de prueba
curl -X POST https://agape-studio.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Playera Test",
    "description": "Descripción de prueba",
    "price": 185.00,
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
    "category": "Colección Principal",
    "tags": ["nuevo"],
    "sizes": ["S", "M", "L"],
    "colors": [{"name": "Negro", "value": "#000000"}]
  }'

# 2. Verificar en el navegador:
# https://agape-studio.vercel.app/tienda

# 3. Probar checkout con tarjeta de prueba Wompi:
#    Número: 4242 4242 4242 4242
#    Fecha: Cualquier fecha futura
#    CVV: 123
```

---

## 📊 Costos Mensuales

| Servicio | Costo |
|----------|-------|
| **Vercel** (Hobby) | $0 |
| **Vercel** (Pro - recomendado) | $20/mes |
| **Supabase** (Free tier) | $0 (hasta 500MB) |
| **Wompi** | Solo comisión por venta (3.5% + IVA) |
| **Dominio** | $10-15/año |

**Total inicial: $0** (con Vercel Hobby y Supabase Free)

---

## 🔒 Seguridad Importante

### ❌ NUNCA expongas estas variables al cliente:
- `WOMPI_PRIVATE_KEY`
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

### ✅ Estas SÍ pueden ir al cliente (NEXT_PUBLIC_):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 🆘 Solución de Problemas

### Error: "Database connection failed"
```
Solución: En Supabase > Settings > Database > IPv4
Desactiva "Enable IP Whitelisting" o agrega 0.0.0.0/0
```

### Error: "Prisma Client not found"
```bash
# En tu proyecto local:
npx prisma generate
git add .
git commit -m "Update prisma client"
git push
```

### Error: "Wompi payment failed"
```
1. Verifica que uses credenciales de Sandbox (no producción)
2. Revisa que NEXT_PUBLIC_APP_URL coincida con tu dominio
3. Verifica que el webhook esté configurado correctamente
```

---

## 🎉 ¡Listo!

Tu tienda online está en producción con:
- ✅ Base de datos PostgreSQL persistente
- ✅ Panel de administración real
- ✅ Procesamiento de pagos con Wompi
- ✅ SSL automático
- ✅ CDN global de Vercel

¿Preguntas? Revisa:
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Wompi](https://docs.wompi.sv)
