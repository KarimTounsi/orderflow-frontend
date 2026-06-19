
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface OrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRequest {
  sessionId: string;
  items: OrderItemRequest[];
  shippingAddress: string;
  customerEmail: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  sessionId: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface RagSource {
  productId: string;
  name: string;
  score: number;
}

export interface RagAnswer {
  answer: string;
  sources: RagSource[];
}

// Wynik GET /api/v1/search/semantic - produkt + trafnosc (rekord SemanticSearchResult)
export interface SemanticSearchResult {
  product: Product;
  score: number;
}
