
import { productClient } from "./client";
import type { Page, Product, CartItem, Cart } from "@/types";

export const productsApi = {
  getAll: (params?: { page?: number; size?: number; category?: string; search?: string }) =>
    productClient.get<Page<Product>>("/api/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    productClient.get<Product>(`/api/products/${id}`).then((r) => r.data),

  getCart: (sessionId: string) =>
    productClient.get<Cart>(`/api/cart/${sessionId}`).then((r) => r.data),

  addToCart: (sessionId: string, item: Omit<CartItem, "productName">) =>
    productClient.post<Cart>(`/api/cart/${sessionId}`, item).then((r) => r.data),

  removeFromCart: (sessionId: string, productId: string) =>
    productClient.delete<Cart>(`/api/cart/${sessionId}/items/${productId}`).then((r) => r.data),

  clearCart: (sessionId: string) =>
    productClient.delete(`/api/cart/${sessionId}`).then((r) => r.data),
};
