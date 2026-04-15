// Helpers para convertir datos de Prisma a JSON-safe antes de enviarlos al cliente.
// Prisma Decimal se serializa como string por defecto; aquí los convertimos a number.

export function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (value && typeof value.toString === 'function') return parseFloat(value.toString());
  return 0;
}

export function serializeProduct(product: any): any {
  if (!product) return product;
  return {
    ...product,
    price: toNumber(product.price),
    originalPrice: product.originalPrice != null ? toNumber(product.originalPrice) : undefined,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
  };
}

export function serializeProducts(products: any[]): any[] {
  return products.map(serializeProduct);
}

export function serializeOrderItem(item: any): any {
  if (!item) return item;
  return {
    ...item,
    price: toNumber(item.price),
    product: item.product ? serializeProduct(item.product) : item.product,
  };
}

export function serializeOrder(order: any): any {
  if (!order) return order;
  return {
    ...order,
    total: toNumber(order.total),
    shippingCost: toNumber(order.shippingCost),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
    shippedAt: order.shippedAt instanceof Date ? order.shippedAt.toISOString() : order.shippedAt,
    deliveredAt: order.deliveredAt instanceof Date ? order.deliveredAt.toISOString() : order.deliveredAt,
    paidAt: order.paidAt instanceof Date ? order.paidAt.toISOString() : order.paidAt,
    items: Array.isArray(order.items) ? order.items.map(serializeOrderItem) : order.items,
    trackingHistory: Array.isArray(order.trackingHistory) ? order.trackingHistory.map((t: any) => ({
      ...t,
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    })) : order.trackingHistory,
  };
}

export function serializeOrders(orders: any[]): any[] {
  return orders.map(serializeOrder);
}
