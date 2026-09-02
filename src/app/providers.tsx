"use client";

import React from "react";
import { AuthProvider } from "@/features/auth/auth-context";
import { CartProvider } from "@/features/cart/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}