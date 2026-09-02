"use client";

import React from "react";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { useCart } from "@/features/cart/cart-context";

const currency = (value: number) => `${value.toLocaleString("fr-FR")} Ar`;

export function CartSheet() {
  const { lines, subtotal, isOpen, closeCart, setQuantity, removeItem } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full flex-col sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Votre panier
          </SheetTitle>
          <SheetDescription>
            {lines.length > 0
              ? `${lines.reduce((s, l) => s + l.quantity, 0)} article(s)`
              : "Votre panier est vide"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Découvrez nos délicieux plats.
              </p>
              <ButtonLink variant="outline" size="sm" href="/client/menu" onClick={closeCart}>
                Voir le menu
              </ButtonLink>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.menuItemId}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                {line.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={line.imageUrl}
                    alt={line.name}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{line.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currency(line.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="outline"
                      onClick={() =>
                        setQuantity(line.menuItemId, line.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="outline"
                      onClick={() =>
                        setQuantity(line.menuItemId, line.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="ml-auto text-destructive hover:text-destructive"
                      onClick={() => removeItem(line.menuItemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <SheetFooter className="flex-col gap-3 sm:flex-col">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="text-lg font-semibold">{currency(subtotal)}</span>
            </div>
            <ButtonLink className="w-full" size="lg" href="/client/checkout" onClick={closeCart}>
              Continuer la commande
            </ButtonLink>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
