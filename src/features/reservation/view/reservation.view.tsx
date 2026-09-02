"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ListComponent from "../components/list";
import {
  getReservations,
  updateReservation,
  updateReservationStatus,
  toApiTime,
} from "@/services/reservations";
import { getTables } from "@/services/tables";
import type { Reservation, ReservationStatus } from "../types/reservation.type";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import { naturalCompare } from "@/lib/utils";
import { usePolling } from "@/hooks/usePolling";

type Props = {
  focusId?: string;
};

const ReservationView = ({ focusId }: Props) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [fetchedReservations, fetchedTables] = await Promise.all([
        getReservations(),
        getTables(),
      ]);
      setReservations(fetchedReservations);
      setTables(
        [...fetchedTables].sort((a, b) => naturalCompare(a.num, b.num)),
      );
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
    Promise.all([getReservations(), getTables()])
      .then(([fetchedReservations, fetchedTables]) => {
        setReservations(fetchedReservations);
        setTables(
          [...fetchedTables].sort((a, b) => naturalCompare(a.num, b.num)),
        );
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

  usePolling(() => {
    Promise.all([getReservations(), getTables()])
      .then(([fetchedReservations, fetchedTables]) => {
        setReservations(fetchedReservations);
        setTables(
          [...fetchedTables].sort((a, b) => naturalCompare(a.num, b.num)),
        );
        setError(null);
      })
      .catch(() => {});
  }, 10000);

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
        <span className="text-sm text-slate-500">Historique &amp; gestion</span>
      </div>
      <ListComponent
        reservationData={reservations}
        tabledata={tables}
        onUpdateReservation={handleUpdateReservation}
        onStatusChange={handleStatusChange}
        focusId={focusId}
      />
    </div>
  );
};

export default ReservationView;