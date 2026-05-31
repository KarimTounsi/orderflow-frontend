"use client";


import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api/orders";
import { getSessionId } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { OrderStatus } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CONFIRMED: "bg-green-500/10 text-green-600 border-green-500/20",
  SHIPPED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function OrdersPage() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", sessionId],
    queryFn: () => ordersApi.getBySession(sessionId),
    enabled: !!sessionId,
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!isLoading && (!orders || orders.length === 0) && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link href="/products">
            <Button className="gap-2">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders?.map((order) => {
          const total = order.total;
          return (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="flex items-center gap-4 rounded-xl border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-muted-foreground truncate">{order.id}</p>
                  <p className="text-sm font-medium">{order.items.length} item(s)</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold">{total.toFixed(2)} PLN</span>
                  <Badge className={`border text-xs ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
