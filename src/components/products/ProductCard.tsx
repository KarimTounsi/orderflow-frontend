"use client";

import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAdding } = useCart();

  return (
    <Card className="group flex flex-col bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 rounded-2xl overflow-hidden">
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-white/[0.03] flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package className="h-14 w-14 text-white/10 group-hover:text-white/15 transition-colors" />
        )}
      </Link>

      <CardContent className="flex flex-col gap-2 p-4 flex-1">
        <p className="text-[11px] text-white/30 uppercase tracking-wider">{product.category}</p>
        <Link href={`/products/${product.id}`} className="hover:text-white/70 transition-colors">
          <h3 className="text-sm font-medium leading-snug line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-semibold">
            {product.price.toFixed(2)}{" "}
            <span className="text-xs font-normal text-white/30">PLN</span>
          </span>
          <span className="text-[11px] text-white/25">
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2 h-8 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/80"
          variant="outline"
          onClick={() => addToCart({ productId: product.id, quantity: 1 })}
          disabled={isAdding || product.stock === 0}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.stock === 0 ? "Sold out" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
