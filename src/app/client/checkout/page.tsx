"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  Loader2,
  ArrowLeft,
  Users,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { getTables } from "@/services/tables";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import type { OrderType, PaymentMethod } from "@/features/order/types/order-types";
import { createClientOrder } from "@/features/client/services/client-orders";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const currency = (value: number) => `${value.toLocaleString("fr-FR")} Ar`;

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: "EAT_IN", label: "Sur place" },
  { value: "TAKEAWAY", label: "À emporter" },
  { value: "DELIVERY", label: "Livraison" },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { value: "CASH", label: "Espèces", icon: Banknote },
  { value: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
  { value: "CARD", label: "Carte bancaire", icon: CreditCard },
];

export default function ClientCheckoutPage() {
  const { customer } = useAuth();
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>("EAT_IN");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOBILE_MONEY");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getTables()
      .then((t) => active && setTables(t))
      .finally(() => active && setLoadingTables(false));
    return () => {
      active = false;
    };
  }, []);

  const availableTables = tables
    .filter((t) => t.status === "AVAILABLE")
    .sort((a, b) => a.num - b.num);

  const needsTable = orderType === "EAT_IN";
  const taxAmount = subtotal * 0.2;
  const total = subtotal + taxAmount;

  const canSubmit =
    lines.length > 0 && (!needsTable || selectedTableId) && paymentMethod;

  const handleSubmit = async () => {
    if (!customer) return;
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const order = await createClientOrder({
        type: orderType,
        customerId: customer.id,
        tableId: needsTable ? selectedTableId : null,
        items: lines.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
        })),
        paymentMethod,
      });
      clear();
      toast.success("Commande créée avec succès !");
      router.push(`/client/orders/success?order=${order.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de créer la commande.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-lg font-medium">Votre panier est vide</p>
        <p className="text-sm text-muted-foreground">
          Découvrez nos délicieux plats avant de passer commande.
        </p>
        <ButtonLink href="/client/menu">Voir le menu</ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <ButtonLink href="/client/menu" variant="ghost" className="-ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au menu
        </ButtonLink>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UtensilsCrossed className="h-4 w-4" /> Type de commande
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {ORDER_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setOrderType(type.value)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm transition-colors",
                    orderType === type.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {needsTable && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Choisissez votre table
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTables ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : availableTables.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune table disponible pour le moment.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {availableTables.map((table) => {
                      const selected = selectedTableId === table.id;
                      return (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() => setSelectedTableId(table.id)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 rounded-lg border px-3 py-4 transition-all",
                            selected
                              ? "border-primary bg-primary/10 ring-2 ring-primary"
                              : "hover:border-primary/50 hover:bg-muted",
                          )}
                        >
                          <span className="text-sm font-semibold">
                            Table {table.num}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {table.capacity}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {table.place}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="h-fit space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lines.map((line) => (
                <div
                  key={line.menuItemId}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {line.name}{" "}
                    <span className="text-muted-foreground">×{line.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {currency(line.price * line.quantity)}
                  </span>
                </div>
              ))}
              <div className="space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>TVA (20%)</span>
                  <span>{currency(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{currency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    paymentMethod === method.value
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <method.icon className="h-4 w-4" />
                  {method.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirmer la commande"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}