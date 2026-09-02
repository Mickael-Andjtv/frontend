"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListComponent from "../components/list";
import { ReservationFormSheet } from "../components/reservation-form";
import {
  getReservations,
  updateReservation,
  updateReservationStatus,
  createReservation,
  toApiTime,
} from "@/services/reservations";
import { getTables } from "@/services/tables";
import { getCustomers } from "@/services/customers";
import type { CreateReservationPayload } from "@/services/reservations";
import type { Reservation, ReservationStatus } from "../types/reservation.type";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import type { Customer } from "@/features/client/types/client.types";

const ReservationView = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [fetchedReservations, fetchedTables, fetchedCustomers] =
        await Promise.all([
          getReservations(),
          getTables(),
          getCustomers(),
        ]);
      setReservations(fetchedReservations);
      setTables(fetchedTables);
      setCustomers(fetchedCustomers);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les réservations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getReservations(), getTables(), getCustomers()])
      .then(([fetchedReservations, fetchedTables, fetchedCustomers]) => {
        setReservations(fetchedReservations);
        setTables(fetchedTables);
        setCustomers(fetchedCustomers);
        setError(null);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les réservations",
        ),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleUpdateReservation = async (
    reservationId: string,
    newTableId: string,
    newTime: string,
  ) => {
    try {
      await updateReservation(reservationId, {
        tableId: newTableId,
        reservationTime: toApiTime(newTime),
      });
      toast.success("Réservation déplacée avec succès");
      await loadData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors du déplacement",
      );
    }
  };

  const handleCreateReservation = async (
    payload: CreateReservationPayload,
  ) => {
    setSaving(true);
    try {
      await createReservation(payload);
      toast.success("Réservation créée avec succès");
      await loadData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de la création",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    reservationId: string,
    status: ReservationStatus,
  ) => {
    try {
      await updateReservationStatus(reservationId, status);
      toast.success(
        status === "CANCELLED"
          ? "Réservation annulée"
          : status === "CONFIRMED"
            ? "Réservation confirmée"
            : "Réservation mise à jour",
      );
      await loadData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors du changement de statut",
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 text-xs text-slate-700 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 pb-0">
        <h1 className="text-xl font-bold">Réservations</h1>
        <ReservationFormSheet
          customers={customers}
          tables={tables}
          onSubmit={handleCreateReservation}
          triggerBtn={
            <Button
              className="border-gray-900 border-2 hover:bg-gray-950 hover:text-white"
              variant="outline"
              disabled={saving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          }
        />
      </div>
      <ListComponent
        reservationData={reservations}
        tabledata={tables}
        onUpdateReservation={handleUpdateReservation}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ReservationView;