"use client";

import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          <div className="h-6 w-6 rounded-md bg-white flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-black" />
          </div>
          OrderFlow
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs h-8">
              Products
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs h-8">
              Orders
            </Button>
          </Link>
        </nav>

        <Link href="/cart">
          <Button variant="outline" size="sm" className="relative gap-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-white text-black">
                {totalItems}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
