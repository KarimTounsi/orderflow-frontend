"use client";


import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isAdding } = useCart();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Product not found.</p>
        <Link href="/products">
          <Button variant="link" className="mt-4">Back to products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <Package className="h-32 w-32 text-muted-foreground/20" />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{product.price.toFixed(2)}</span>
            <span className="text-muted-foreground">PLN</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {product.stock > 0
              ? `${product.stock} units in stock`
              : "Out of stock"}
          </p>

          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto"
            disabled={isAdding || product.stock === 0}
            onClick={() =>
              addToCart({
                productId: product.id,
                quantity: 1,
              })
            }
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
