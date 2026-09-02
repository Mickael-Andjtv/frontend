"use client";

import { useState } from "react";
import { Users, MapPin, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RestaurantTable, TableStatus } from "../types/table";
import { AddTableComponet } from "./add";
import { ConfirmModal } from "@/components/layout/confirm-modal";

type Props = {
  resTable: RestaurantTable;
  onUpdateTable?: (table: RestaurantTable) => void;
  onUpdateStatus?: (id: string, status: TableStatus) => void;
  onDeleteTable?: (id: string) => void;
};

const STATUS_BADGE: Record<TableStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: "Disponible",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  OCCUPIED: {
    label: "Occupée",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  RESERVED: {
    label: "Réservée",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  UNAVAILABLE: {
    label: "Indisponible",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const STATUS_OPTIONS: TableStatus[] = [
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "UNAVAILABLE",
];

const STATUS_LABELS: Record<TableStatus, string> = {
  AVAILABLE: "Disponible",
  OCCUPIED: "Occupée",
  RESERVED: "Réservée",
  UNAVAILABLE: "Indisponible",
};

const TableCard = ({
  resTable,
  onUpdateTable,
  onUpdateStatus,
  onDeleteTable,
}: Props) => {
  const [showDelete, setShowDelete] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TableStatus | null>(null);

  const status = resTable.status ?? "AVAILABLE";
  const statusBadge = STATUS_BADGE[status] ?? STATUS_BADGE.AVAILABLE;
  const capacityBadge =
    resTable.status === "UNAVAILABLE" ? "Indisponible" : `${resTable.capacity} Couverts`;

  return (
    <>
      <Card className="w-full rounded-none border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900">
            Table {resTable.num}
          </CardTitle>
          <Badge
            variant="outline"
            className={`rounded-none text-slate-700 font-medium text-[11px] ${capacityBadge === "Indisponible" ? "border-slate-300 text-slate-400" : ""}`}
          >
            {capacityBadge}
          </Badge>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              Capacité :{" "}
              <strong className="text-slate-900 font-semibold">
                {resTable.capacity} personnes
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{resTable.place ?? "Salle principale"}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <Badge
              variant="outline"
              className={`rounded-none font-medium text-[10px] ${statusBadge.className}`}
            >
              {statusBadge.label}
            </Badge>

            {onUpdateStatus && (
              <Select
                value={status}
                onValueChange={(value) =>
                  setPendingStatus(value as TableStatus)
                }
              >
                <SelectTrigger
                  className="h-7 w-32 rounded-none text-[11px] border-slate-200"
                  aria-label="Changer le statut"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="rounded-none text-xs"
                    >
                      {STATUS_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-1 p-3 pt-0 bg-white">
          <AddTableComponet
            addBtn={
              <Button variant="ghost" size="sm" className={"rounded-none"}>
                <Edit className="h-3.5 w-3.5" />
                Modifier
              </Button>
            }
            tableData={resTable}
            isAdd={false}
            onSubmit={onUpdateTable}
          />

          {onDeleteTable && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          )}
        </CardFooter>
      </Card>

      <ConfirmModal
        open={showDelete}
        title="Supprimer la table"
        description={`Confirmer la suppression de la table ${resTable.num} (${resTable.capacity} couverts) ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => onDeleteTable?.(resTable.id)}
        onOpenChange={setShowDelete}
      />

      <ConfirmModal
        open={pendingStatus !== null}
        title="Changer le statut de la table"
        description={
          pendingStatus
            ? `Confirmer le changement de statut de la table ${resTable.num} vers « ${STATUS_LABELS[pendingStatus]} » ?`
            : ""
        }
        confirmLabel="Confirmer"
        onConfirm={() => {
          if (pendingStatus) onUpdateStatus?.(resTable.id, pendingStatus);
          setPendingStatus(null);
        }}
        onOpenChange={(openValue) => {
          if (!openValue) setPendingStatus(null);
        }}
      />
    </>
  );
};

export default TableCard;