"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";

function FeaturedProductCard({ product }: { product: Product }) {
  const { addToCart, isAdding } = useCart();

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
      <Link href={`/products/${product.id}`} className="relative aspect-square rounded-xl bg-white/[0.03] flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package className="h-12 w-12 text-white/10" />
        )}
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} className="text-sm font-medium leading-tight hover:text-white/70 transition-colors line-clamp-2">
            {product.name}
          </Link>
        </div>
        <p className="text-xs text-white/40">{product.category}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-base font-semibold">{product.price.toFixed(2)} <span className="text-xs font-normal text-white/40">PLN</span></span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-white/10 bg-white/5 hover:bg-white/10"
          disabled={isAdding || product.stock === 0}
          onClick={() => addToCart({ productId: product.id, quantity: 1 })}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.getAll({ size: 4 }),
  });

  const featured = data?.content.slice(0, 4) ?? [];

  return (
    <div className="flex flex-col gap-24">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 pt-16 pb-8">
        <Badge variant="outline" className="border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
          Event-driven e-commerce · Spring Boot + Kafka
        </Badge>

        <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter max-w-3xl leading-[1.05]">
          Shop smarter,{" "}
          <span className="text-white/30">delivered faster</span>
        </h1>

        <p className="text-base text-white/40 max-w-md leading-relaxed">
          Event-driven order processing powered by microservices. Every order triggers an event chain - from placement to your inbox.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link href="/products">
            <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl h-11 px-6">
              Browse all products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/orders">
            <Button size="lg" variant="ghost" className="text-white/50 hover:text-white rounded-xl h-11 px-6">
              Track order
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest">Featured</h2>
            <Link href="/products" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/5">
        {[
          { value: "3", label: "Microservices" },
          { value: "Kafka", label: "Event streaming" },
          { value: "At-least-once", label: "Event delivery" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 bg-white/[0.02] py-8 px-4 text-center">
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-white/40">{stat.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
