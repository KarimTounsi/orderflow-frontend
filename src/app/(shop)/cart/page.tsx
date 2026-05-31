"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Trash2, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, isLoading, totalItems, total, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!cart || totalItems === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Link href="/products">
          <Button className="gap-2">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cart</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-2" onClick={() => clearCart()}>
          <Trash2 className="h-4 w-4" />
          Clear cart
        </Button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-xl border p-4">
            <div className="relative h-14 w-14 bg-muted rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.productName} fill sizes="56px" className="object-cover" />
              ) : (
                <Package className="h-6 w-6 text-muted-foreground/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.productName}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity} × {Number(item.price).toFixed(2)} PLN
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold">
                {Number(item.lineTotal).toFixed(2)} PLN
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive h-7 px-2"
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Summary */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">Total ({totalItems} items)</span>
          <span className="font-bold text-2xl">{total.toFixed(2)} PLN</span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full gap-2">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
