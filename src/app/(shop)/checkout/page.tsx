"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { ordersApi } from "@/lib/api/orders";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, total, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    shippingAddress: "",
    customerEmail: "",
  });

  const orderMutation = useMutation({
    mutationFn: () =>
      ordersApi.create({
        sessionId: getSessionId(),
        items: cart!.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.price),
        })),
        shippingAddress: form.shippingAddress,
        customerEmail: form.customerEmail,
      }),
    onSuccess: (order) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed! Check your email for confirmation.");
      router.push(`/orders/${order.id}`);
    },
    onError: () => toast.error("Failed to place order. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || totalItems === 0) return;
    orderMutation.mutate();
  };

  if (!cart || totalItems === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
      {/* Form */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.customerEmail}
              onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Order confirmation will be sent here via fulfillment-service.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Shipping address</Label>
            <Input
              id="address"
              placeholder="ul. Przykładowa 1, Warszawa"
              required
              value={form.shippingAddress}
              onChange={(e) => setForm((f) => ({ ...f, shippingAddress: e.target.value }))}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={orderMutation.isPending}
          >
            {orderMutation.isPending ? "Placing order..." : `Place order — ${total.toFixed(2)} PLN`}
          </Button>
        </form>
      </div>

      {/* Order summary */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="rounded-xl border p-4 flex flex-col gap-3">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative h-10 w-10 bg-muted rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {Number(item.lineTotal).toFixed(2)} PLN
              </p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} PLN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
