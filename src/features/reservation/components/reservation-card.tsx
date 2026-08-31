"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Customer } from "@/features/client/types/client.types";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldAlert, MessageSquare } from "lucide-react";

type Props = {
  id?: string;
  dateEnd: string;
  description?: string;
  status: string;
  customer: Customer;
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

export const ReservationCard = ({
  id,
  status,
  dateEnd,
  description,
  customer,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id || "",
      disabled: !id,
    });

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`h-full w-full ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        className={`h-full w-full rounded-none border border-slate-200 border-l-4 ${currentStatusStyle.border} bg-white p-2.5 shadow-sm hover:border-slate-400 transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between gap-1.5`}
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
              {status}
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
      </Card>
    </div>
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