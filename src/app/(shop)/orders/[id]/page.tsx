"use client";


import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, XCircle, Clock, Truck } from "lucide-react";
import Link from "next/link";
import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const SETTLED_STATUSES: OrderStatus[] = ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && SETTLED_STATUSES.includes(status)) return false;
      return 3000;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Order not found.</p>
        <Link href="/products">
          <Button variant="link" className="mt-4">Back to shop</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const total = order.total;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-3 rounded-xl border p-4 ${statusConfig.color}`}>
        <StatusIcon className="h-6 w-6" />
        <div>
          <p className="font-semibold">{statusConfig.label}</p>
          <p className="text-sm opacity-75">
            {order.status === "PENDING" && "Waiting for fulfillment service to process..."}
            {order.status === "CONFIRMED" && "Email confirmation sent!"}
            {order.status === "CANCELLED" && "Order was cancelled — fulfillment failed after all retries."}
          </p>
        </div>
        {!SETTLED_STATUSES.includes(order.status) && (
          <div className="ml-auto h-2 w-2 rounded-full bg-current animate-pulse" />
        )}
      </div>

      {/* Items */}
      <div className="rounded-xl border p-4 flex flex-col gap-3">
        <h2 className="font-semibold">Items</h2>
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <Package className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.productName}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {item.unitPrice.toFixed(2)} PLN</p>
            </div>
            <p className="text-sm font-medium">{(item.quantity * item.unitPrice).toFixed(2)} PLN</p>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{total.toFixed(2)} PLN</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-xl border p-4 flex flex-col gap-1">
        <h2 className="font-semibold">Shipping address</h2>
        <p className="text-muted-foreground">{order.shippingAddress}</p>
      </div>

      <div className="flex gap-3">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/orders">
          <Button variant="ghost">All Orders</Button>
        </Link>
      </div>
    </div>
  );
}
