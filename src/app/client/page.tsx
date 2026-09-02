"use client";

import React, { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  CalendarDays,
  History,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { getClientOrders } from "@/features/client/services/client-orders";
import { getClientReservations } from "@/features/client/services/client-reservations";
import type { Order } from "@/features/order/types/order-types";
import type { Reservation } from "@/features/reservation/types/reservation.type";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDashboardPage() {
  const { customer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) return;
    let active = true;
    Promise.all([
      getClientOrders(customer.id),
      getClientReservations(customer.id),
    ])
      .then(([o, r]) => {
        if (!active) return;
        setOrders(o);
        setReservations(r);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [customer]);

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
  );
  const upcomingReservations = reservations.filter(
    (r) => r.status === "PENDING" || r.status === "CONFIRMED",
  );
  const fullName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : "";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground sm:p-8">
        <p className="text-sm opacity-80">Bienvenue</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{fullName}</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">
          Parcourez notre menu, passez une commande ou réservez une table en
          quelques secondes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/client/menu" variant="secondary">
            <UtensilsCrossed className="h-4 w-4" /> Commander maintenant
          </ButtonLink>
          <ButtonLink
            href="/client/reservations"
            variant="secondary"
            className="bg-white/15 text-primary-foreground hover:bg-white/25"
          >
            <CalendarDays className="h-4 w-4" /> Réserver une table
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes actives
            </CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{activeOrders.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations à venir
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{upcomingReservations.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total commandes
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{orders.length}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4" /> Dernières commandes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune commande pour le moment.
              </p>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {order.totalAmount.toLocaleString("fr-FR")} Ar
                  </span>
                </div>
              ))
            )}
            {!loading && orders.length > 0 && (
              <ButtonLink href="/client/orders" variant="link" className="px-0">
                Voir toutes mes commandes <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Réservations à venir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : upcomingReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune réservation à venir.
              </p>
            ) : (
              upcomingReservations.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{r.reservationDate}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.reservationTime} · {r.numberOfGuests} personnes
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase text-primary">
                    {r.status}
                  </span>
                </div>
              ))
            )}
            {!loading && upcomingReservations.length > 0 && (
              <ButtonLink href="/client/reservations" variant="link" className="px-0">
                Gérer mes réservations <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}