"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Receipt,
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { getClientOrders } from "@/features/client/services/client-orders";
import type { Order, OrderStatus } from "@/features/order/types/order-types";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "PENDING", label: "En attente", icon: Clock },
  { status: "CONFIRMED", label: "Confirmée", icon: CheckCircle2 },
  { status: "PREPARING", label: "En préparation", icon: ChefHat },
  { status: "READY", label: "Prête", icon: BellRing },
  { status: "COMPLETED", label: "Terminée", icon: PackageOpen },
];

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: "Votre commande a été enregistrée.",
  CONFIRMED: "Votre commande a été confirmée.",
  PREPARING: "Votre commande est en préparation 👨‍🍳",
  READY: "Votre commande est prête !",
  COMPLETED: "Votre commande a été terminée.",
  CANCELLED: "Votre commande a été annulée.",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-zinc-400",
  CONFIRMED: "bg-sky-500",
  PREPARING: "bg-amber-500",
  READY: "bg-emerald-500",
  COMPLETED: "bg-green-600",
  CANCELLED: "bg-red-500",
};

export default function ClientOrdersPage() {
  const { customer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const seenStatuses = useRef<Map<string, OrderStatus>>(new Map());

  const orderCompletedSeen = (order: Order) =>
    order.status === "COMPLETED" || order.status === "CANCELLED";

  const fetchOrders = useCallback(async () => {
    if (!customer) return;
    try {
      const next = await getClientOrders(customer.id);
      setOrders(next);
      setError(false);
      next.forEach((order) => {
        const previous = seenStatuses.current.get(order.id);
        if (previous && previous !== order.status && !orderCompletedSeen(order)) {
          toast.success(`Commande ${order.orderNumber}`, {
            description: STATUS_MESSAGES[order.status],
          });
        }
        seenStatuses.current.set(order.id, order.status);
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (!customer) return;
    let active = true;

    const refresh = async () => {
      if (!active) return;
      try {
        const next = await getClientOrders(customer.id);
        if (!active) return;
        setOrders(next);
        setError(false);
        next.forEach((order) => {
          const previous = seenStatuses.current.get(order.id);
          if (
            previous &&
            previous !== order.status &&
            !(previous === "PENDING" && (order.status === "COMPLETED" || order.status === "CANCELLED"))
          ) {
            toast.success(`Commande ${order.orderNumber}`, {
              description: STATUS_MESSAGES[order.status],
            });
          }
          seenStatuses.current.set(order.id, order.status);
        });
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    refresh();
    const timer = setInterval(refresh, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [customer]);

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
  );
  const history = orders.filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED",
  );

  const OrderCard = ({ order }: { order: Order }) => {
    const stepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);
    const isCancelled = order.status === "CANCELLED";
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">#{order.orderNumber}</CardTitle>
            <Badge className={cn("text-white", STATUS_COLORS[order.status])}>
              {STATUS_STEPS.find((s) => s.status === order.status)?.label ??
                order.status}
            </Badge>
          </div>
          <span className="text-sm font-semibold">
            {order.totalAmount.toLocaleString("fr-FR")} Ar
          </span>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              {new Date(order.createdAt).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
            {order.tableNumber && <span>Table {order.tableNumber}</span>}
            <span>{order.items.length} article(s)</span>
          </div>

          {!isCancelled && (
            <div className="flex items-center">
              {STATUS_STEPS.map((step, index) => {
                const reached = index <= stepIndex;
                return (
                  <React.Fragment key={step.status}>
                    {index > 0 && (
                      <div
                        className={cn(
                          "mx-1 h-0.5 flex-1 rounded",
                          index <= stepIndex ? "bg-primary" : "bg-muted",
                        )}
                      />
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2",
                          reached
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-muted/40 text-muted-foreground",
                        )}
                      >
                        <step.icon className="h-4 w-4" />
                      </span>
                      <span className="hidden text-[10px] sm:block">
                        {step.label}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/40" />
        <p>Impossible de charger vos commandes.</p>
        <Button variant="outline" onClick={fetchOrders}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
        <PackageOpen className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-lg font-medium">Aucune commande pour le moment</p>
        <p className="text-sm text-muted-foreground">
          Parcourez notre menu et passez votre première commande.
        </p>
        <ButtonLink href="/client/menu">Voir le menu</ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes commandes</h1>
          <p className="text-sm text-muted-foreground">
            Suivez l&apos;avancement de vos commandes en temps réel.
          </p>
        </div>
        <ButtonLink href="/client/menu" variant="outline" size="sm">Nouvelle commande</ButtonLink>
      </div>

      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">En cours</h2>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Historique</h2>
          {history.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Badge className={cn("text-white", STATUS_COLORS[order.status])}>
                    {order.status === "CANCELLED" ? "Annulée" : "Terminée"}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {order.totalAmount.toLocaleString("fr-FR")} Ar
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Mise à jour automatique…
        </p>
      )}
    </div>
  );
}