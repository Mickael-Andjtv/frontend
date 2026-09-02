"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  Loader2,
  CalendarPlus,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import {
  createClientReservation,
  getClientReservations,
  currentIsoDate,
} from "@/features/client/services/client-reservations";
import type { Reservation } from "@/features/reservation/types/reservation.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toApiTime } from "@/services/reservations";
import { getTables } from "@/services/tables";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESERVATION_TIME_SLOTS } from "@/features/reservation/constants/creneaux";

const TIME_SLOTS = RESERVATION_TIME_SLOTS;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: "Votre réservation a été enregistrée.",
  CONFIRMED: "Votre réservation a été confirmée.",
  CANCELLED: "Votre réservation a été annulée.",
  COMPLETED: "Votre réservation est terminée. Votre table est prête !",
};

function isPast(reservation: Reservation): boolean {
  const date = new Date(`${reservation.reservationDate}T${to24h(reservation.reservationTime)}`);
  return date.getTime() < Date.now();
}

function to24h(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return time;
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = match[3]?.toUpperCase();
  if (suffix === "PM" && hours !== 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

export default function ClientReservationsPage() {
  const { customer } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [date, setDate] = useState(currentIsoDate());
  const [time, setTime] = useState("7:00 PM");
  const [guests, setGuests] = useState(2);
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [tableId, setTableId] = useState("");

  const seenStatuses = useRef<Map<string, string>>(new Map());

  const notifyChange = (res: Reservation) => {
    const previous = seenStatuses.current.get(res.id);
    if (previous && previous !== res.status) {
      toast.success(`Réservation du ${res.reservationDate}`, {
        description: STATUS_MESSAGES[res.status] ?? `Statut : ${res.status}`,
      });
    }
    seenStatuses.current.set(res.id, res.status);
  };

  const fetchReservations = useCallback(async () => {
    if (!customer) return;
    try {
      const next = await getClientReservations(customer.id);
      setReservations(next);
      setError(false);
      next.forEach(notifyChange);
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
        const next = await getClientReservations(customer.id);
        if (!active) return;
        setReservations(next);
        setError(false);
        next.forEach((res) => {
          const previous = seenStatuses.current.get(res.id);
          if (previous && previous !== res.status) {
            toast.success(`Réservation du ${res.reservationDate}`, {
              description: STATUS_MESSAGES[res.status] ?? `Statut : ${res.status}`,
            });
          }
          seenStatuses.current.set(res.id, res.status);
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
  void fetchReservations;

  useEffect(() => {
    let active = true;
    getTables()
      .then((t) => active && setTables(t))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const availableTables = tables
    .filter((t) => t.status === "AVAILABLE" && t.capacity >= guests)
    .sort((a, b) => a.num - b.num);

  const handleCreate = async () => {
    if (!customer) return;
    if (!date || !time || guests < 1) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setSubmitting(true);
    try {
      const assignedTableId =
        tableId || availableTables[0]?.id || null;
      await createClientReservation({
        customerId: customer.id,
        reservationDate: date,
        reservationTime: toApiTime(time),
        numberOfGuests: guests,
        tableId: assignedTableId,
        specialRequest: request || undefined,
      });
      seenStatuses.current.clear();
      toast.success("Réservation créée avec succès !");
      setShowForm(false);
      setRequest("");
      setTableId("");
      await getClientReservations(customer.id).then((next) =>
        next.forEach((res) => seenStatuses.current.set(res.id, res.status)),
      );
      fetchReservations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de créer la réservation.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const future = reservations.filter((r) => !isPast(r));
  const past = reservations.filter((r) => isPast(r));

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes réservations</h1>
          <p className="text-sm text-muted-foreground">
            Gérez et suivez vos réservations de table.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Fermer" : "Réserver"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarPlus className="h-4 w-4" /> Nouvelle réservation
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="r-date">Date</Label>
              <Input
                id="r-date"
                type="date"
                min={currentIsoDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-time">Heure</Label>
              <select
                id="r-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-guests">Nombre de personnes</Label>
              <Input
                id="r-guests"
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-table">Table (optionnelle)</Label>
              <Select value={tableId} onValueChange={(v) => v !== null && setTableId(v)}>
                <SelectTrigger id="r-table" className="w-full">
                  <SelectValue placeholder="À attribuer par le restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Aucune table disponible pour ce nombre de personnes
                    </div>
                  ) : (
                    availableTables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        Table {table.num} · {table.capacity} pers.
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="r-request">Demande particulière (optionnel)</Label>
              <Textarea
                id="r-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Près de la fenêtre, chaise haute, allergies..."
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirmer la réservation"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && reservations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
          <p>Impossible de charger vos réservations.</p>
          <Button variant="outline" onClick={() => fetchReservations()}>
            Réessayer
          </Button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">Aucune réservation</p>
          <p className="text-sm text-muted-foreground">
            Réservez une table et nous nous occupons du reste.
          </p>
          <Button onClick={() => setShowForm(true)}>Réserver une table</Button>
        </div>
      ) : (
        <>
          {future.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">À venir</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {future.map((r) => (
                  <Card key={r.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <p className="text-lg font-semibold">
                          {new Date(
                            `${r.reservationDate}T00:00:00`,
                          ).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                        <Badge
                          className={cn(
                            r.status === "CONFIRMED" && "bg-green-600",
                            r.status === "PENDING" && "bg-amber-500",
                            r.status === "CANCELLED" && "bg-red-500",
                          )}
                        >
                          {STATUS_LABELS[r.status] ?? r.status}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> {r.reservationTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> {r.numberOfGuests}{" "}
                          personnes
                        </p>
                        {r.specialRequest && (
                          <p className="mt-1 text-xs italic">
                            « {r.specialRequest} »
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Historique</h2>
              <div className="space-y-3">
                {past.map((r) => (
                  <Card key={r.id} className="opacity-70">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div>
                        <p className="text-sm font-medium">{r.reservationDate}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.reservationTime} · {r.numberOfGuests} personnes
                        </p>
                      </div>
                      <Badge variant="outline">
                        {STATUS_LABELS[r.status] ?? r.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Mise à jour
              automatique…
            </p>
          )}
        </>
      )}
    </div>
  );
}