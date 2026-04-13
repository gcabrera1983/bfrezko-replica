// Servicio de API para comunicación con el backend
import { Product, Order } from '@/types'
import { products as demoProducts } from '@/data/products'

const API_BASE = '/api'

// Modo demo: usa productos locales si no hay base de datos
// En cliente, siempre usamos demo mode (no hay conexión a Supabase desde el navegador)
const DEMO_MODE = typeof window !== 'undefined' || !process.env.DATABASE_URL

// ======= ORDENES EN LOCALSTORAGE (MODO DEMO) =======
const getDemoOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  const orders = localStorage.getItem('agape-demo-orders')
  return orders ? JSON.parse(orders) : []
}

const saveDemoOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('agape-demo-orders', JSON.stringify(orders))
}

// ======= PRODUCTOS EN LOCALSTORAGE (MODO DEMO) =======
const DEMO_PRODUCTS_KEY = 'agape-demo-products'

const getDemoProducts = (): Product[] => {
  if (typeof window === 'undefined') return [...demoProducts]
  const products = localStorage.getItem(DEMO_PRODUCTS_KEY)
  return products ? JSON.parse(products) : [...demoProducts]
}

const saveDemoProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products))
}

// Productos
export async function fetchProducts(params?: { 
  category?: string 
  isNew?: boolean 
  isBestseller?: boolean 
  search?: string 
}): Promise<Product[]> {
  if (DEMO_MODE) {
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
        p.description.toLowerCase().includes(search) ||
        p.tags.some(t => t.toLowerCase().includes(search))
      )
    }
    
    return filtered
  }

  const queryParams = new URLSearchParams()
  if (params?.category) queryParams.set('category', params.category)
  if (params?.isNew) queryParams.set('isNew', 'true')
  if (params?.isBestseller) queryParams.set('isBestseller', 'true')
  if (params?.search) queryParams.set('search', params.search)
  
  const res = await fetch(`${API_BASE}/products?${queryParams}`)
  if (!res.ok) throw new Error('Error cargando productos')
  return res.json()
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  if (DEMO_MODE) {
    return getDemoProducts().find(p => p.id === id)
  }

  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error('Producto no encontrado')
  return res.json()
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (DEMO_MODE) {
    const products = getDemoProducts()
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now()
    }
    products.push(newProduct)
    saveDemoProducts(products)
    return newProduct
  }

  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error creando producto')
  return res.json()
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  if (DEMO_MODE) {
    const products = getDemoProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Producto no encontrado')
    
    const updatedProduct = {
      ...products[index],
      ...product,
      id // Mantener el ID original
    }
    products[index] = updatedProduct
    saveDemoProducts(products)
    return updatedProduct
  }

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error actualizando producto')
  return res.json()
}

export async function deleteProduct(id: string): Promise<void> {
  if (DEMO_MODE) {
    const products = getDemoProducts()
    const filtered = products.filter(p => p.id !== id)
    saveDemoProducts(filtered)
    return
  }

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error eliminando producto')
}

// Órdenes
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
    items: orderData.items.map((item, i) => ({
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

  if (DEMO_MODE) {
    // Guardar en localStorage
    const orders = getDemoOrders()
    orders.unshift(order)
    saveDemoOrders(orders)
    return order
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  if (!res.ok) throw new Error('Error creando orden')
  return res.json()
}

export async function fetchOrders(): Promise<Order[]> {
  if (DEMO_MODE) {
    return getDemoOrders()
  }

  const res = await fetch(`${API_BASE}/orders`)
  if (!res.ok) throw new Error('Error cargando órdenes')
  return res.json()
}

export async function fetchOrder(id: string): Promise<Order | null> {
  if (DEMO_MODE) {
    const orders = getDemoOrders()
    return orders.find(o => o.id === id) || null
  }

  const res = await fetch(`${API_BASE}/orders/${id}`)
  if (!res.ok) throw new Error('Orden no encontrada')
  return res.json()
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  if (DEMO_MODE) {
    const orders = getDemoOrders()
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Orden no encontrada')
    
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() }
    saveDemoOrders(orders)
    return orders[index]
  }

  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error('Error actualizando orden')
  return res.json()
}

// Checkout Wompi (ya no se usa, mantenido por compatibilidad)
export async function initiateWompiPayment(data: {
  orderId: string
  amount: number
  customerEmail: string
  customerName: string
  redirectUrl?: string
}): Promise<any> {
  return {
    transactionId: `demo_${Date.now()}`,
    reference: `ORDER-${data.orderId}-${Date.now()}`,
    amount: data.amount,
    currency: 'GTQ',
    status: 'PENDING',
    checkoutUrl: `/checkout/success?orderId=${data.orderId}`,
    sandbox: true
  }
}
