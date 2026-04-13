export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  shippingCost: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
  paymentId?: string;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'REFUNDED';
  paidAt?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  productId: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
}
