// Normaliza datos que vienen de la API para asegurar tipos correctos en el cliente.
// Prisma Decimal puede serializarse como string; aquí forzamos number.

export function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (value && typeof value.toString === 'function') return parseFloat(value.toString());
  return 0;
}

export function normalizeProduct(product: any): any {
  if (!product) return product;
  return {
    ...product,
    price: toNumber(product.price),
    originalPrice: product.originalPrice != null ? toNumber(product.originalPrice) : undefined,
    images: Array.isArray(product.images) ? product.images : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
  };
}

export function normalizeProducts(products: any[]): any[] {
  return products.map(normalizeProduct);
}

export function normalizeOrderItem(item: any): any {
  if (!item) return item;
  return {
    ...item,
    price: toNumber(item.price),
    quantity: toNumber(item.quantity),
    product: item.product ? normalizeProduct(item.product) : item.product,
  };
}

export function normalizeOrder(order: any): any {
  if (!order) return order;
  return {
    ...order,
    total: toNumber(order.total),
    shippingCost: toNumber(order.shippingCost),
    items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : order.items,
    trackingHistory: Array.isArray(order.trackingHistory) ? order.trackingHistory.map((t: any) => ({
      ...t,
      createdAt: t.createdAt || new Date().toISOString(),
    })) : (order.trackingHistory || []),
  };
}

export function normalizeOrders(orders: any[]): any[] {
  return orders.map(normalizeOrder);
}
