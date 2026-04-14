# 🚀 Configuración para Producción con Base de Datos

Esta guía te lleva paso a paso para configurar tu tienda con base de datos real.

---

## 📋 RESUMEN DEL PROCESO

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. SUPABASE   │────▶│ 2. MIGRACIONES  │────▶│  3. VERCEL      │
│   (Base Datos)  │     │   (Crear Tablas)│     │   (Deploy)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## PASO 1: Crear Base de Datos en Supabase

### 1.1 Crear Cuenta y Proyecto

1. Ve a https://supabase.com
2. Clic en **"New Project"**
3. Completa:
   - **Name:** `agape-studio`
   - **Database Password:** (genera una segura y GUÁRDALA)
   - **Region:** `East US` (N. Virginia)
   - **Plan:** Free Tier

```
┌─────────────────────────────────────────────────────────────┐
│  Create a new project                                       │
│                                                             │
│  Organization:    your-email@gmail.com            ▼        │
│                                                             │
│  Project name:    agape-studio                              │
│                                                             │
│  Database Password:  [•••••••••••••••••••••••••]  [Generate]│
│  ⚠️ GUARDA ESTA CONTRASEÑA                                  │
│                                                             │
│  Region:          East US (N. Virginia)           ▼        │
│                                                             │
│                    [Create new project]                     │
└─────────────────────────────────────────────────────────────┘
```

4. Espera 2-3 minutos a que se cree

---

### 1.2 Obtener Credenciales

Ve a **Project Settings** (engranaje) → **Database**:

```
┌─────────────────────────────────────────────────────────────┐
│  Connection string                                          │
│  ─────────────────                                          │
│  postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co│
│                                                         :5432/postgres
│                                                             │
│  [Copy]  ← Copia este string completo                       │
└─────────────────────────────────────────────────────────────┘
```

Ve a **Project Settings** → **API**:

```
┌─────────────────────────────────────────────────────────────┐
│  Project URL                                                │
│  https://xxxxxxxxx.supabase.co          [Copy]              │
│                                                             │
│  anon public                                                │
│  eyJhbGciOiJIUzI1NiIs...                [Copy]              │
│                                                             │
│  service_role secret                                        │
│  eyJhbGciOiJIUzI1NiIs...                [Copy]              │
│  ⚠️ NUNCA compartir esta clave                              │
└─────────────────────────────────────────────────────────────┘
```

---

## PASO 2: Configurar Variables en Vercel

### 2.1 Ir a Vercel Dashboard

```
https://vercel.com/gcabrera1983s-projects/bfrezko-replica/settings/environment-variables
```

### 2.2 Agregar Variables

Haz clic en **"Add"** y agrega cada una:

```
┌─────────────────────────────────────────────────────────────┐
│  ENVIRONMENT VARIABLES                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NAME                            VALUE                      │
│  ─────────────────────────────────────────────────────────  │
│  DATABASE_URL                    postgresql://postgres:     │
│                                  TU_PASS@db.xxx.supabase.co:│
│                                  5432/postgres              │
│                                                             │
│  NEXT_PUBLIC_SUPABASE_URL        https://xxx.supabase.co    │
│                                                             │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY   eyJhbGciOiJIUzI1NiIs...    │
│                                                             │
│  SUPABASE_SERVICE_ROLE_KEY       eyJhbGciOiJIUzI1NiIs...    │
│                                                             │
│  NEXT_PUBLIC_APP_URL             https://agapestudio.business│
│                                                             │
│  JWT_SECRET                      minimo-32-caracteres-seguro │
│                                  s-muy-largo-para-jwt-2024   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Importante:** 
- ✅ Marca todas como `Production` y `Preview`
- 🔒 `DATABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` son secretas

---

## PASO 3: Crear Tablas en Supabase

### 3.1 Ir al SQL Editor

En Supabase dashboard:
```
SQL Editor → New Query
```

### 3.2 Ejecutar Script de Creación

Copia y pega este SQL:

```sql
-- Crear extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Órdenes
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  status TEXT DEFAULT 'PENDING',
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT,
  postal_code TEXT,
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Items de Orden
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id)
);

-- Tabla de Administradores
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar admin por defecto
INSERT INTO admins (email, password, name)
VALUES ('admin', 'agape2024', 'Administrador')
ON CONFLICT (email) DO NOTHING;

-- Políticas de seguridad básicas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de productos
CREATE POLICY "Allow public read products" ON products
  FOR SELECT USING (true);

-- Permitir lectura de órdenes (por email)
CREATE POLICY "Allow read own orders" ON orders
  FOR SELECT USING (true);
```

Haz clic en **"Run"** (Ctrl+Enter)

---

## PASO 4: Migrar Productos Demo

### 4.1 En tu computadora local

```bash
# Clonar el repositorio
git clone https://github.com/gcabrera1983/bfrezko-replica.git
cd bfrezko-replica

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Generar cliente de Prisma
npx prisma generate

# Migrar productos de demo a la base de datos
npx prisma db seed

# O ejecutar el script directamente
npx ts-node scripts/seed-database.ts
```

---

## PASO 5: Deploy en Vercel

### 5.1 Redeploy Forzado

En Vercel dashboard:
```
Deployments → [•••] en el último → Redeploy
✅ Marca: "Force clear cache and redeploy"
```

O usa CLI:
```bash
npx vercel --prod --force
```

### 5.2 Verificar Deploy

Espera 2-3 minutos y verifica:
- ✅ Build exitoso (sin errores)
- ✅ Variables de entorno cargadas
- ✅ Conexión a base de datos funcionando

---

## PASO 6: Pruebas

### 6.1 Probar Panel Admin

```
1. Ve a: https://agapestudio.business/admin
2. Login: admin / agape2024
3. Editar un producto
4. Guardar cambios
5. Verificar que persiste en la base de datos
```

### 6.2 Verificar en Supabase

```
Supabase → Table Editor → products
Deberías ver tus productos con los cambios aplicados
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Database connection failed"

```
Solución: En Supabase → Database → IPv4
Desactiva "Enable IP Whitelisting" 
o agrega: 0.0.0.0/0
```

### Error: "Prisma schema not found"

```bash
npx prisma generate
npx prisma db push
```

### Error: "Table does not exist"

```bash
# Ejecutar migraciones manualmente
npx prisma migrate dev --name init
# o
npx prisma db push
```

---

## ✅ CHECKLIST FINAL

- [ ] Proyecto Supabase creado
- [ ] Credenciales copiadas correctamente
- [ ] Variables configuradas en Vercel
- [ ] Tablas creadas en Supabase
- [ ] Productos migrados
- [ ] Deploy exitoso en Vercel
- [ ] Panel admin funciona
- [ ] Cambios persisten entre dispositivos
- [ ] Móvil sincroniza con desktop

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs en Vercel: Dashboard → Deployments → View Logs
2. Verifica conexión en Supabase: SQL Editor → `SELECT * FROM products;`
3. Confirma variables: Vercel → Settings → Environment Variables

**¿Necesitas ayuda con algún paso específico?**
