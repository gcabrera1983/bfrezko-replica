// Servicio de API para comunicación con el backend
import { Product, Order } from '@/types'
import { products as demoProducts } from '@/data/products'
import { normalizeProducts, normalizeProduct, normalizeOrders, normalizeOrder } from '@/lib/normalize'

const API_BASE = '/api'

// Detectar si estamos en modo demo o producción
// En el cliente (navegador), SIEMPRE usamos API routes
// En el servidor, usamos demo solo si no hay DATABASE_URL
const isClient = typeof window !== 'undefined'
const DEMO_MODE = !isClient && !process.env.DATABASE_URL

// ======= MODO PRODUCCIÓN CON BASE DE DATOS =======

// Productos API
export async function fetchProducts(params?: { 
  category?: string 
  isNew?: boolean 
  isBestseller?: boolean 
  search?: string 
}): Promise<Product[]> {
  const queryParams = new URLSearchParams()
  if (params?.category) queryParams.set('category', params.category)
  if (params?.isNew) queryParams.set('isNew', 'true')
  if (params?.isBestseller) queryParams.set('isBestseller', 'true')
  if (params?.search) queryParams.set('search', params.search)
  
  const res = await fetch(`${API_BASE}/products?${queryParams}`)
  if (!res.ok) throw new Error('Error cargando productos')
  const data = await res.json()
  return normalizeProducts(data)
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error('Producto no encontrado')
  const data = await res.json()
  return normalizeProduct(data)
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error creando producto')
  const data = await res.json()
  return normalizeProduct(data)
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error actualizando producto')
  const data = await res.json()
  return normalizeProduct(data)
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error eliminando producto')
}

// Órdenes API
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`)
  if (!res.ok) throw new Error('Error cargando órdenes')
  const data = await res.json()
  return normalizeOrders(data)
}

export async function fetchOrder(id: string): Promise<Order | null> {
  const res = await fetch(`${API_BASE}/orders/${id}`)
  if (!res.ok) throw new Error('Orden no encontrada')
  const data = await res.json()
  return normalizeOrder(data)
}

export async function createOrder(orderData: {
  items: any[]
  customer: {
    email: string
    firstName: string
    lastName: string
    phone: string
  }
  shipping: {
    address: string
    city: string
    department: string
    postalCode: string
  }
  total: number
  shippingCost: number
}): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  if (!res.ok) throw new Error('Error creando orden')
  const data = await res.json()
  return normalizeOrder(data)
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error('Error actualizando orden')
  const data = await res.json()
  return normalizeOrder(data)
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error eliminando orden')
}

// ======= MODO DEMO (Fallback sin base de datos) =======
// Estas funciones se usan cuando no hay DATABASE_URL configurada

// Almacenamiento en memoria para modo demo
let demoProductsStorage: Product[] | null = null
let demoOrdersStorage: Order[] | null = null

const getDemoProducts = (): Product[] => {
  if (!demoProductsStorage) {
    demoProductsStorage = [...demoProducts]
  }
  return demoProductsStorage
}

const saveDemoProducts = (products: Product[]) => {
  demoProductsStorage = [...products]
}

const getDemoOrders = (): Order[] => {
  if (!demoOrdersStorage) {
    demoOrdersStorage = []
  }
  return demoOrdersStorage
}

const saveDemoOrders = (orders: Order[]) => {
  demoOrdersStorage = [...orders]
}

// Funciones de modo demo (se exportan solo si DEMO_MODE es true)
export const demoApi = {
  fetchProducts: async (params?: any): Promise<Product[]> => {
    let filtered = [...getDemoProducts()]
    
    if (params?.category) {
      filtered = filtered.filter(p => p.category === params.category)
    }
    if (params?.isNew) {
      filtered = filtered.filter(p => p.isNew)
    }
    if (params?.isBestseller) {
      filtered = filtered.filter(p => p.isBestseller)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      )
    }
    
    return filtered
  },
  
  fetchProduct: async (id: string): Promise<Product | undefined> => {
    return getDemoProducts().find(p => p.id === id)
  },
  
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now()
    }
    const products = getDemoProducts()
    products.push(newProduct)
    saveDemoProducts(products)
    return newProduct
  },
  
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const products = getDemoProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Producto no encontrado')
    
    const updatedProduct = { ...products[index], ...updates, id }
    products[index] = updatedProduct
    saveDemoProducts(products)
    return updatedProduct
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    const products = getDemoProducts()
    const filtered = products.filter(p => p.id !== id)
    saveDemoProducts(filtered)
  },
  
  fetchOrders: async (): Promise<Order[]> => {
    return getDemoOrders()
  },
  
  fetchOrder: async (id: string): Promise<Order | null> => {
    return getDemoOrders().find(o => o.id === id) || null
  },
  
  createOrder: async (orderData: any): Promise<Order> => {
    const order: Order = {
      id: 'ORD-' + Date.now(),
      status: 'PENDING',
      total: orderData.total,
      shippingCost: orderData.shippingCost,
      customerEmail: orderData.customer.email,
      customerName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      customerPhone: orderData.customer.phone,
      address: orderData.shipping.address,
      city: orderData.shipping.city,
      department: orderData.shipping.department,
      postalCode: orderData.shipping.postalCode,
      paymentStatus: 'PENDING',
      items: orderData.items.map((item: any, i: number) => ({
        id: `item-${i}`,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        productId: item.productId,
        product: {
          id: item.productId,
          name: item.name,
          image: item.image || ''
        }
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const orders = getDemoOrders()
    orders.unshift(order)
    saveDemoOrders(orders)
    return order
  },
  
  updateOrder: async (id: string, updates: Partial<Order>): Promise<Order> => {
    const orders = getDemoOrders()
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Orden no encontrada')
    
    const updatedOrder = { ...orders[index], ...updates, id }
    orders[index] = updatedOrder
    saveDemoOrders(orders)
    return updatedOrder
  }
}
