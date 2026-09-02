"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Customer } from "@/features/client/types/client.types";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ShieldAlert,
  MessageSquare,
  Check,
  History,
  ChevronRight,
} from "lucide-react";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReservationStatus } from "../types/reservation.type";

type Props = {
  id?: string;
  dateEnd: string;
  dateLabel?: string;
  description?: string;
  status: string;
  customer: Customer;
  isPast?: boolean;
  onStatusChange?: (id: string, status: ReservationStatus) => void;
};

const TIER_BADGES: Record<string, string> = {
  BRONZE: "bg-amber-700 text-white hover:bg-amber-700",
  SILVER: "bg-slate-400 text-white hover:bg-slate-400",
  GOLD: "bg-amber-500 text-white hover:bg-amber-500",
  VIP: "bg-purple-600 text-white hover:bg-purple-600",
};

const STATUS_STYLING: Record<string, { border: string; badge: string }> = {
  CONFIRMED: {
    border: "border-l-emerald-600",
    badge: "bg-emerald-600 text-white hover:bg-emerald-600",
  },
  PENDING: {
    border: "border-l-amber-500",
    badge: "bg-amber-500 text-white hover:bg-amber-500",
  },
  CANCELLED: {
    border: "border-l-rose-600",
    badge: "bg-rose-600 text-white hover:bg-rose-600",
  },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

const STATUS_OPTIONS: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

export const ReservationCard = ({
  id,
  status,
  dateEnd,
  dateLabel,
  description,
  customer,
  isPast = false,
  onStatusChange,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id || "",
      disabled: isPast || !id,
    });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus>(
    () => (status.toUpperCase() as ReservationStatus) || "PENDING",
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  const initials = `${customer.firstName?.[0] || ""}${
    customer.lastName?.[0] || ""
  }`.toUpperCase();

  const statusUpper = status.toUpperCase();
  const currentStatusStyle = STATUS_STYLING[statusUpper] || {
    border: "border-l-slate-400",
    badge: "bg-slate-500 text-white",
  };

  const currentStatus = (statusUpper as ReservationStatus) || "PENDING";

  const openSheet = () => {
    if (isPast || !id) return;
    setSelectedStatus(currentStatus);
    setSheetOpen(true);
  };

  const openConfirm = () => {
    setShowConfirm(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`h-full w-full ${isDragging ? "opacity-50" : ""}`}
      >
        <Card
          onClick={openSheet}
          className={`h-full w-full rounded-none border border-slate-200 border-l-4 ${currentStatusStyle.border} bg-white p-2.5 shadow-sm transition-all flex flex-col justify-between gap-1.5 ${
            isPast
              ? "opacity-60 grayscale cursor-not-allowed select-none"
              : "cursor-pointer hover:border-slate-400"
          }`}
        >
          {/* En-tête : Avatar & Infos Client */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-7 w-7 border border-slate-200 shrink-0">
                <AvatarImage
                  src={customer.image}
                  alt={`${customer.firstName} ${customer.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-900 text-white font-medium text-[10px]">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col truncate">
                <span className="font-semibold text-slate-900 text-xs truncate leading-tight">
                  {customer.firstName} {customer.lastName}
                </span>

                <div className="flex items-center gap-1 mt-0.5">
                  {customer.loyalty?.tier && (
                    <Badge
                      className={`rounded-none text-[9px] px-1 py-0 font-bold uppercase ${
                        TIER_BADGES[customer.loyalty.tier] || "bg-slate-500"
                      }`}
                    >
                      {customer.loyalty.tier}
                    </Badge>
                  )}

                  {customer.status === "BLOCKED" && (
                    <Badge
                      variant="destructive"
                      className="rounded-none text-[9px] px-1 py-0 flex items-center gap-0.5"
                    >
                      <ShieldAlert className="w-2.5 h-2.5" />
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 gap-0.5">
              <Badge
                className={`rounded-none text-[9px] px-1.5 py-0 font-bold uppercase ${currentStatusStyle.badge}`}
              >
                {STATUS_LABELS[statusUpper] || status}
              </Badge>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-slate-400" />
                {dateEnd}
              </span>
            </div>
          </div>

          {/* Note / Demande spéciale */}
          {description && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 italic bg-slate-50 p-1 border border-slate-100 truncate">
              <MessageSquare className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="truncate">{description}</span>
            </div>
          )}

          {isPast ? (
            <div
              className="flex items-center justify-center gap-1.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="h-6 flex-1 rounded-none border border-slate-200 bg-slate-50 text-slate-400 text-[10px] font-medium flex items-center justify-center gap-1">
                <History className="w-3 h-3" /> Passée
              </span>
            </div>
          ) : (
            <div
              className="flex items-center justify-end gap-1.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="h-6 px-2 rounded-none border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Changer le statut
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 rounded-none">
          <SheetHeader className="p-4 border-b shrink-0">
            <SheetTitle className="text-lg font-bold">Réservation</SheetTitle>
            <SheetDescription className="text-xs">
              Modifier le statut de la réservation de {customer.firstName}{" "}
              {customer.lastName}
              {dateLabel ? ` • ${dateLabel}` : ""} à {dateEnd}.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Statut
              </span>
              <Select
                value={selectedStatus}
                onValueChange={(val) =>
                  val && setSelectedStatus(val as ReservationStatus)
                }
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt} className="rounded-none">
                      {STATUS_LABELS[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="p-4 border-t shrink-0 flex gap-2">
            <Button
              className="w-full"
              disabled={selectedStatus === currentStatus}
              onClick={openConfirm}
            >
              Enregistrer le statut
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSheetOpen(false)}
            >
              Annuler
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        open={showConfirm}
        title="Changer le statut de la réservation"
        description={`Confirmer le passage de la réservation de ${customer.firstName} ${customer.lastName} à « ${STATUS_LABELS[selectedStatus]} » ?`}
        confirmLabel="Confirmer"
        destructive={
          selectedStatus === "CANCELLED" || selectedStatus === "COMPLETED"
        }
        onConfirm={() => {
          if (!id) return;
          onStatusChange?.(id, selectedStatus);
          setShowConfirm(false);
          setSheetOpen(false);
        }}
        onOpenChange={(openValue) => {
          if (!openValue) setShowConfirm(false);
        }}
      />
    </>
  );
};

export const ReservationEmptyCard = () => {
  return (
    <Card className="h-full w-full rounded-none border border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center group shadow-none">
      <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        + Libre
      </span>
    </Card>
  );
};