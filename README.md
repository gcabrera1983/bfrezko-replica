# BFREZKO Replica

Réplica de una tienda de ropa estilo BFREZKO construida con Next.js 14, React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Página de Inicio** - Hero banner, productos destacados, newsletter
- **Catálogo de Productos** - Filtros por categoría, precio, ordenamiento
- **Detalle de Producto** - Selector de tallas/colores, galería de imágenes
- **Carrito de Compras** - Persistencia en localStorage, actualización de cantidades
- **Checkout** - Formulario de envío, pago contra entrega (demo)
- **Diseño Responsive** - Optimizado para móvil, tablet y desktop

## 🛠️ Tecnologías

- [Next.js 14](https://nextjs.org/) - Framework React con App Router
- [React 18](https://react.dev/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Lucide React](https://lucide.dev/) - Iconos

## 📁 Estructura del Proyecto

```
bfrezko-replica/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── page.tsx            # Página de inicio
│   │   ├── layout.tsx          # Layout principal
│   │   ├── tienda/             # Página de catálogo
│   │   ├── producto/[id]/      # Página de producto
│   │   ├── carrito/            # Página de carrito
│   │   └── checkout/           # Página de checkout
│   ├── components/
│   │   ├── Header.tsx          # Navegación principal
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── products/           # Componentes de productos
│   │   └── ui/                 # Componentes UI reutilizables
│   ├── context/
│   │   └── CartContext.tsx     # Contexto del carrito
│   ├── data/
│   │   └── products.ts         # Datos de productos
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   └── lib/
│       └── utils.ts            # Utilidades
├── public/                     # Archivos estáticos
└── next.config.mjs            # Configuración de Next.js
```

## 🚀 Iniciar el Proyecto

### Requisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# O iniciar servidor de producción (requiere build)
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📝 Notas

- Los productos están almacenados en `/src/data/products.ts`
- El carrito persiste en localStorage
- Las imágenes se cargan desde Unsplash
- El checkout es una simulación (no procesa pagos reales)

## 🎨 Personalización

### Agregar Nuevos Productos

Edita el archivo `src/data/products.ts` y añade nuevos objetos al array `products`:

```typescript
{
  id: "producto-nuevo",
  name: "Nombre del Producto",
  description: "Descripción...",
  price: 99.99,
  image: "url-de-imagen",
  images: ["url1", "url2"],
  category: "Categoría",
  tags: ["tag1", "tag2"],
  sizes: ["S", "M", "L"],
  colors: [{ name: "Rojo", value: "#FF0000" }],
  inStock: true,
  isNew: true,
  isBestseller: false
}
```

### Cambiar Colores/Temas

Modifica las clases de Tailwind en los componentes. Los colores principales están en:
- Fondo blanco: `bg-white`
- Texto negro: `text-black` / `bg-black`
- Grises: `gray-50`, `gray-100`, `gray-600`, etc.

## 📄 Licencia

Este proyecto es una réplica educativa. Los derechos del diseño original pertenecen a BFREZKO.
