"use client";

import React, { useState, useMemo } from "react";
import { DndContext, DragEndEvent, useDroppable, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { toast } from "sonner";
import { Reservation, ReservationStatus } from "../types/reservation.type";
import { RestaurantTable } from "@/features/restaurant-table/types/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReservationCard, ReservationEmptyCard } from "./reservation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ConfirmMoveModal } from "@/components/layout/confirm-move";
import { normalizeApiTime } from "@/services/reservations";
import { RESERVATION_TIME_SLOTS } from "@/features/reservation/constants/creneaux";

type Props = {
  reservationData: Reservation[];
  tabledata: RestaurantTable[];
  onUpdateReservation?: (
    reservationId: string,
    newTableId: string,
    newTime: string,
  ) => void;
  onStatusChange?: (
    reservationId: string,
    status: ReservationStatus,
  ) => void;
  focusId?: string;
};

const CRENAUX = RESERVATION_TIME_SLOTS;

const todayISO = new Date().toISOString().slice(0, 10);

/**
 * A reservation is considered "past" (read-only) once its full 60-minute slot
 * has elapsed. While the slot is ongoing or in the future, it stays editable.
 */
function isReservationPast(reservation: Reservation): boolean {
  const apiTime = normalizeApiTime(reservation.reservationTime);
  if (!apiTime) return true;
  const [hours, minutes] = apiTime.split(":").map((p) => Number(p) || 0);
  const slotStart = new Date(
    `${reservation.reservationDate}T${String(hours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}:00`,
  );
  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
  return new Date().getTime() > slotEnd.getTime();
}

const DroppableCell = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <TableCell
      ref={setNodeRef}
      className={`p-1 border-r border-slate-100 align-top h-16 transition-colors ${
        isOver ? "bg-slate-100" : ""
      }`}
    >
      {children}
    </TableCell>
  );
};

const ListReservation = ({
  reservationData: reservations,
  tabledata,
  onUpdateReservation,
  onStatusChange,
  focusId,
}: Props) => {
  const itemsPerPage = 5;

  const focusedReservation = useMemo(
    () => reservations.find((r) => r.id === focusId),
    [reservations, focusId],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => focusedReservation?.reservationDate ?? todayISO,
  );
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [pendingMove, setPendingMove] = useState<{
    reservationId: string;
    targetTableId: string;
    targetTableName?: string;
    targetTime: string;
  } | null>(null);

  // Keep the focus target's table column visible on first load.
  const initialStart = useMemo(() => {
    if (!focusedReservation || !focusedReservation.tableId) return 0;
    const idx = tabledata.findIndex((t) => t.id === focusedReservation.tableId);
    if (idx < 0) return 0;
    const maxStart = Math.max(0, tabledata.length - itemsPerPage);
    return Math.min(maxStart, Math.floor(idx / itemsPerPage) * itemsPerPage);
  }, [focusedReservation, tabledata, itemsPerPage]);

  const [start, setStart] = useState(() => (focusId ? initialStart : 0));

  // When arriving with a ?id= focus, position the date filter and the table
  // column on the targeted reservation once its data has loaded. We adjust
  // state during render (not in an effect) using the "focused date already
  // applied?" guard so this converges without an extra render cycle.
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  if (
    focusId &&
    focusedDate === null &&
    focusedReservation &&
    focusedReservation.reservationDate !== focusedDate
  ) {
    setFocusedDate(focusedReservation.reservationDate);
    setSelectedDate(focusedReservation.reservationDate);
    setStart(initialStart);
  }

  // A drag only starts after the cursor moves at least MIN_DRAG_DISTANCE px.
  // A plain pointer down / click without real movement is therefore handled as
  // a regular click (opens the status Sheet) instead of a drag & drop.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const reservationId = String(active.id);
    const [targetTableId, targetTime] = String(over.id).split("|");

    const isOccupied = reservations.some(
      (r) =>
        r.tableId === targetTableId &&
        r.reservationTime === targetTime &&
        r.id !== reservationId,
    );

    if (isOccupied) {
      toast.error("Cette table est déjà réservée à ce créneau !");
      return;
    }

    const targetTable = tabledata.find((t) => t.id === targetTableId);

    setPendingMove({
      reservationId,
      targetTableId,
      targetTableName: targetTable ? `Table ${targetTable.num}` : undefined,
      targetTime,
    });
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    const { reservationId, targetTableId, targetTime } = pendingMove;

    if (onUpdateReservation) {
      onUpdateReservation(reservationId, targetTableId, targetTime);
    }

    setPendingMove(null);
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const query = searchQuery.toLowerCase().trim();

      const firstName = (r.customer?.firstName ?? "").toLowerCase();
      const lastName = (r.customer?.lastName ?? "").toLowerCase();
      const email = (r.customer?.email ?? "").toLowerCase();
      const specialReq = (r.specialRequest ?? "").toLowerCase();
      const resId = (r.id ?? "").toLowerCase();

      const matchesSearch =
        !query ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        email.includes(query) ||
        specialReq.includes(query) ||
        resId.includes(query);

      const matchesDate = !selectedDate || r.reservationDate === selectedDate;

      const matchesStatus =
        statusFilter === "ALL" || r.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [reservations, searchQuery, selectedDate, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSelectedDate(todayISO);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    selectedDate !== todayISO;

  const visibleTable = tabledata.slice(start, start + itemsPerPage);

  const handlePrev = () => setStart((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStart((prev) => Math.min(tabledata.length - itemsPerPage, prev + 1));

  return (
    <DndContext
      id="reservation-dnd-context"
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col gap-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h1 className="font-bold text-xl text-slate-900">Réservations</h1>
          <span className="text-xs text-slate-500 font-medium">
            {tabledata.length} tables au total
          </span>
        </div>

        <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-white">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par client, note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative flex items-center">
                <CalendarIcon className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-9 h-9 w-40 bg-white text-xs border-slate-200 font-medium rounded-none"
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-slate-500 rounded-none hover:text-slate-900 h-9"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3" /> Statut :
            </span>

            <Badge
              variant={statusFilter === "ALL" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter("ALL")}
            >
              Tous
            </Badge>

            <Badge
              variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
              className={`cursor-pointer ${
                statusFilter === "CONFIRMED"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "CONFIRMED" ? "ALL" : "CONFIRMED",
                )
              }
            >
              Confirmés
            </Badge>

            <Badge
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              className={`cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === "PENDING" ? "ALL" : "PENDING")
              }
            >
              En attente
            </Badge>

            <Badge
              variant={statusFilter === "CANCELLED" ? "default" : "outline"}
              className={`cursor-pointer ${
                statusFilter === "CANCELLED"
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "CANCELLED" ? "ALL" : "CANCELLED",
                )
              }
            >
              Annulés
            </Badge>
          </div>
        </div>

        <Table className="w-full table-fixed border-collapse">
          <TableHeader className="bg-white">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="w-24 text-center align-middle p-2 border-r border-slate-100">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-none border border-slate-200 bg-white hover:bg-slate-50"
                    onClick={handlePrev}
                    disabled={start === 0}
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-none border border-slate-200 bg-white hover:bg-slate-50"
                    onClick={handleNext}
                    disabled={start >= tabledata.length - itemsPerPage}
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              </TableHead>

              {visibleTable.map((t) => (
                <TableHead
                  key={t.id}
                  className="p-4 border-r border-slate-100 align-top"
                >
                  <div className="flex flex-col">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Table {t.num}
                    </h4>
                    <div className="flex flex-col gap-1.5 mt-2 text-[11px] font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-700" />
                        {t.capacity} personnes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-700" />
                        Intérieur
                      </span>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {CRENAUX.map((ck, i) => (
              <TableRow
                key={i}
                className="h-16 hover:bg-transparent border-b border-slate-100"
              >
                <TableCell className="text-center text-[11px] font-medium text-slate-600 border-r border-slate-100 align-top pt-2">
                  {ck}
                </TableCell>

                {visibleTable.map((t) => {
                  const filter = filteredReservations.find(
                    (r) => r.tableId === t.id && r.reservationTime === ck,
                  );
                  const dropId = `${t.id}|${ck}`;

                  return (
                    <DroppableCell key={dropId} id={dropId}>
                      {filter ? (
                        <ReservationCard
                          customer={filter.customer}
                          id={filter.id}
                          dateEnd={filter.reservationTime}
                          dateLabel={filter.reservationDate}
                          status={filter.status}
                          description={filter.specialRequest ?? ""}
                          isPast={isReservationPast(filter)}
                          isFocused={filter.id === focusId}
                          autoOpen={filter.id === focusId}
                          onStatusChange={onStatusChange}
                        />
                      ) : (
                        <ReservationEmptyCard />
                      )}
                    </DroppableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ConfirmMoveModal
          isOpen={!!pendingMove}
          moveDetails={pendingMove}
          onConfirm={confirmMove}
          onCancel={() => setPendingMove(null)}
        />
      </div>
    </DndContext>
  );
};

export default ListReservation;
