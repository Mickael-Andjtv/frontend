"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Customer } from "../types/client.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, ShoppingBag, ShieldAlert } from "lucide-react";

type Props = {
  customer: Customer;
};

const TIER_BADGES: Record<string, string> = {
  BRONZE: "bg-amber-700 text-white hover:bg-amber-700",
  SILVER: "bg-slate-400 text-white hover:bg-slate-400",
  GOLD: "bg-amber-500 text-white hover:bg-amber-500",
  VIP: "bg-purple-600 text-white hover:bg-purple-600",
};

const ClientCardComponent = ({ customer }: Props) => {
  const initials =
    `${customer.firstName?.[0] || ""}${customer.lastName?.[0] || ""}`.toUpperCase();

  return (
    <Card className="h-full rounded-none border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all cursor-pointer shadow-sm">
      <CardHeader className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12  border border-slate-200">
              <AvatarImage
                src={customer.image}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="object-cover"
              />
              <AvatarFallback className=" bg-slate-900 text-white font-medium text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <h3 className="font-semibold text-slate-900 text-base leading-tight">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge
                  className={`rounded-none text-[10px] px-1.5 py-0 font-bold uppercase ${
                    TIER_BADGES[customer.loyalty.tier] || "bg-slate-500"
                  }`}
                >
                  {customer.loyalty.tier}
                </Badge>

                {customer.status === "BLOCKED" && (
                  <Badge
                    variant="destructive"
                    className="rounded-none text-[10px] px-1.5 py-0 flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3 h-3" /> Bloqué
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase font-medium">
              Points
            </span>
            <span className="text-sm font-bold text-slate-900">
              {customer.loyalty.points} pts
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 text-xs text-slate-600">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 truncate">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{customer.phone}</span>
          </div>
        </div>

        {customer.preferences && (
          <div className="flex flex-wrap gap-1 pt-1">
            {customer.preferences.isVegetarian && (
              <Badge
                variant="outline"
                className="rounded-none text-[10px] bg-green-600 text-white"
              >
                Végétarien
              </Badge>
            )}
            {customer.preferences.isGlutenFree && (
              <Badge
                variant="outline"
                className="rounded-none text-[10px] bg-amber-500 text-white"
              >
                Sans Gluten
              </Badge>
            )}
            {customer.preferences.allergies?.map((allergy) => (
              <Badge
                key={allergy}
                variant="outline"
                className="rounded-none text-[10px] bg-rose-600 text-white "
              >
                {allergy}
              </Badge>
            ))}
          </div>
        )}

        {customer.stats && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {customer.stats.totalOrders} cmd ({customer.stats.totalSpent}€)
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.stats.totalReservations} résa</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCardComponent;
