"use client";

import React from "react";
import { RequireAuth } from "@/features/auth/require-auth";
import { ClientNavbar } from "@/features/client/components/client-navbar";
import { CartSheet } from "@/features/cart/cart-sheet";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <ClientNavbar />
        <CartSheet />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}