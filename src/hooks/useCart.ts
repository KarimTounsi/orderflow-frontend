"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/products";
import { getSessionId } from "@/lib/session";
import type { CartItem } from "@/types";
import { toast } from "sonner";

export function useCart() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", sessionId],
    queryFn: () => productsApi.getCart(sessionId),
    enabled: !!sessionId,
  });

  const addMutation = useMutation({
    mutationFn: (item: { productId: string; quantity: number }) =>
      productsApi.addToCart(sessionId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
      toast.success("Added to cart");
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      productsApi.removeFromCart(sessionId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
      toast.success("Removed from cart");
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => productsApi.clearCart(sessionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] }),
  });

  const totalItems = cart?.itemCount ?? 0;
  const total = Number(cart?.total ?? 0);

  return {
    cart,
    isLoading,
    totalItems,
    total,
    addToCart: addMutation.mutate,
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    isAdding: addMutation.isPending,
  };
}
