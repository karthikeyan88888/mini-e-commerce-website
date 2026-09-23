export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  sku: string;
  status: ProductStatus;
  rating: number;
  specs?: string; // JSON string
  has3DModel?: boolean;
  modelUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartProductItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  itemTotal: number;
  isAvailable: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartProductItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  quantity: number;
  priceAtPurchase: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId?: string;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
}

export interface SalesTrendData {
  day: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusDistribution {
  status: OrderStatus;
  count: number;
}
