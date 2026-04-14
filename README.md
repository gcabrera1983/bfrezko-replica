# Ágape Studio - Tienda Online

Tienda de ropa cristiana construida con Next.js 14, React, TypeScript, Tailwind CSS y Prisma.

---

## 🚀 Deploy Rápido a Producción

Haz clic en el botón para desplegar automáticamente en Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gcabrera1983/bfrezko-replica&project-name=agape-studio&repository-name=agape-studio)

> **Nota:** Necesitarás cuentas en [Supabase](https://supabase.com) (base de datos) y [Wompi](https://wompi.sv) (pagos). Ver guía detallada en [`DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md)

---

## ✨ Características

- **🛍️ Catálogo de Productos** - Filtros por categoría, búsqueda, ordenamiento
- **📦 Detalle de Producto** - Selector de tallas/colores, galería de imágenes
- **🛒 Carrito de Compras** - Persistencia en localStorage, actualización de cantidades
- **💳 Checkout** - Pago contra entrega y transferencia bancaria
- **📊 Panel de Administración** - Gestión de productos, órdenes y tracking
- **🔐 Autenticación** - Login con JWT para acceso admin
- **💰 Integración Wompi** - Procesamiento de pagos (BAC Credomatic)
- **📱 Diseño Responsive** - Optimizado para móvil, tablet y desktop

---

## 🛠️ Tecnologías

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Base de Datos** | PostgreSQL (Supabase) |
| **Pagos** | Wompi API (BAC Credomatic) |
| **Animaciones** | Framer Motion |
| **Iconos** | Lucide React |

---

## 📁 Estructura del Proyecto

```
bfrezko-replica/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── page.tsx            # Página de inicio
│   │   ├── layout.tsx          # Layout principal
│   │   ├── tienda/             # Catálogo de productos
│   │   ├── producto/[id]/      # Detalle de producto
│   │   ├── carrito/            # Carrito de compras
│   │   ├── checkout/           # Proceso de pago
│   │   ├── rastreo/            # Tracking de órdenes
│   │   ├── admin/              # Panel de administración
│   │   └── api/                # API Routes (products, orders, webhooks)
│   ├── components/             # Componentes reutilizables
│   ├── context/                # Contextos (Cart, Products, Admin)
│   ├── data/                   # Datos estáticos (demo)
│   ├── lib/                    # Utilidades y API client
│   ├── types/                  # Tipos TypeScript
│   └── prisma/                 # Schema de Prisma
├── public/                     # Archivos estáticos
└── next.config.mjs            # Configuración de Next.js
```

---

## 🚀 Iniciar el Proyecto Localmente

### Requisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (copiar ejemplo)
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Generar Prisma Client
npx prisma generate

# 4. Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Acceso al Panel de Admin

- **URL:** `http://localhost:3000/admin`
- **Usuario:** `admin`
- **Password:** `agape2024`

---

## 📝 Configuración para Producción

### Variables de Entorno Requeridas

```env
# Supabase (Base de datos)
DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TU_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="TU_SERVICE_KEY"

# Wompi (Pagos)
WOMPI_PUBLIC_KEY="pub_test_xxx"
WOMPI_PRIVATE_KEY="prv_test_xxx"
WOMPI_API_URL="https://sandbox.wompi.sv"
WOMPI_WEBHOOK_SECRET="whsec_xxx"

# App
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"
JWT_SECRET="minimo-32-caracteres-seguros"
```

### Guía Completa de Deploy

Ver [`DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md) para instrucciones detalladas paso a paso con pantallas.

---

## 🎨 Personalización

### Agregar Nuevos Productos

1. **Via Panel Admin:** Ve a `/admin/productos/nuevo`
2. **Via API:**

```bash
curl -X POST https://tu-dominio.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nueva Playera",
    "description": "Descripción del producto",
    "price": 185.00,
    "image": "https://ejemplo.com/imagen.jpg",
    "images": ["https://ejemplo.com/imagen.jpg"],
    "category": "Colección Principal",
    "tags": ["nuevo", "bestseller"],
    "sizes": ["S", "M", "L", "XL"],
    "colors": [{"name": "Negro", "value": "#000000"}],
    "inStock": true,
    "isNew": true,
    "isBestseller": false
  }'
```

### Cambiar Colores/Temas

Los colores principales de la marca están en:
- **Primario:** `#6B4423` (Café/cobre)
- **Secundario:** `#889E81` (Verde salvia)
- **Fondo:** `#FDF9F3` (Crema)
- **Acento:** `#F6D3B3` (Durazno)

Modifica en `tailwind.config.ts` o directamente en las clases de los componentes.

---

## 💳 Tarjetas de Prueba (Wompi Sandbox)

| Tarjeta | Número | Fecha | CVV |
|---------|--------|-------|-----|
| Visa Aprobada | `4242 4242 4242 4242` | Cualquiera futura | `123` |
| Mastercard Aprobada | `5555 5555 5555 4444` | Cualquiera futura | `123` |
| Tarjeta Rechazada | `4000 0000 0000 0002` | Cualquiera futura | `123` |

---

## 📊 Costos Mensuales Estimados

| Servicio | Costo |
|----------|-------|
| **Vercel** (Hobby) | $0 |
| **Supabase** (Free tier) | $0 (hasta 500MB) |
| **Wompi** | Solo comisión por venta (3.5% + IVA) |
| **Dominio** | $10-15/año |

**Total inicial: $0** 🎉

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa [`DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md) - Guía detallada
2. Revisa [`DEPLOY.md`](./DEPLOY.md) - Configuración técnica
3. Consulta los logs de Vercel: Dashboard > Deployments > View Logs

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
# bfrezko-replica
