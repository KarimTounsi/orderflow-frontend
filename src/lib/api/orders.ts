import { orderClient } from "./client";
import type { Order, OrderRequest } from "@/types";

export const ordersApi = {
  create: (order: OrderRequest) =>
    orderClient.post<Order>("/api/v1/orders", order).then((r) => r.data),

  getById: (id: string) =>
    orderClient.get<Order>(`/api/v1/orders/${id}`).then((r) => r.data),

  getBySession: (sessionId: string) =>
    orderClient.get<{ content: Order[] }>("/api/v1/orders", { params: { sessionId } }).then((r) => r.data.content),
};
