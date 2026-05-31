
import { productClient } from "./client";
import type { Page, Product, CartItem, Cart } from "@/types";

export const productsApi = {
  getAll: (params?: { page?: number; size?: number; category?: string; search?: string }) =>
    productClient.get<Page<Product>>("/api/v1/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    productClient.get<Product>(`/api/v1/products/${id}`).then((r) => r.data),

  getCart: (sessionId: string) =>
    productClient.get<Cart>("/api/v1/cart", { headers: { "X-Session-Id": sessionId } }).then((r) => r.data),

  addToCart: (sessionId: string, item: { productId: string; quantity: number }) =>
    productClient.post<Cart>("/api/v1/cart/items", item, { headers: { "X-Session-Id": sessionId } }).then((r) => r.data),

  removeFromCart: (sessionId: string, productId: string) =>
    productClient.delete<Cart>(`/api/v1/cart/items/${productId}`, { headers: { "X-Session-Id": sessionId } }).then((r) => r.data),

  clearCart: (sessionId: string) =>
    productClient.delete("/api/v1/cart", { headers: { "X-Session-Id": sessionId } }).then((r) => r.data),
};
