"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCustomerAvatar } from "@/lib/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Customer, LoyaltyTier } from "../types/client.types";
import { Mail, Phone, UserCheck, Award } from "lucide-react";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { formatAr } from "@/lib/money";

type Props = {
  customer: Customer;
  detail: React.ReactNode;
  onUpdate?: (customer: Customer) => void;
  autoOpen?: boolean;
};

const TIER_BADGES: Record<string, string> = {
  BRONZE: "bg-amber-700 text-white hover:bg-amber-700",
  SILVER: "bg-slate-400 text-white hover:bg-slate-400",
  GOLD: "bg-amber-500 text-white hover:bg-amber-500",
  VIP: "bg-purple-600 text-white hover:bg-purple-600",
};

const TIER_THRESHOLDS: [number, string][] = [
  [3000, "VIP"],
  [2000, "GOLD"],
  [1000, "SILVER"],
];

const computeTier = (points: number): LoyaltyTier => {
  for (const [threshold, tier] of TIER_THRESHOLDS) {
    if (points >= threshold) return tier as LoyaltyTier;
  }
  return "BRONZE";
};

export const CustomerDetailsSheet = ({ customer, detail, onUpdate, autoOpen = false }: Props) => {
  const [data, setData] = useState<Customer>(customer);
  const [open, setOpen] = useState(() => autoOpen);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initials =
    `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase();
  const avatarSrc = getCustomerAvatar(data);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate?.(data);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div
  onClick={() => setOpen(true)}
  className="cursor-pointer h-full"
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      setOpen(true);
    }
  }}
>
  {detail}
</div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 rounded-none bg-white border-l border-slate-200 flex flex-col justify-between">
          <div className="overflow-y-auto flex-1">
            <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-slate-200 shrink-0">
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${data.firstName} ${data.lastName}`}
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-slate-900 text-white font-medium text-base">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col truncate">
                  <SheetTitle className="text-lg font-bold text-slate-900 truncate">
                    {data.firstName} {data.lastName}
                  </SheetTitle>

                  <span className="text-xs text-slate-500 font-mono">
                    ID: {data.id}
                  </span>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Badge
                      className={`rounded-none text-[10px] px-1.5 py-0 font-bold uppercase ${
                        TIER_BADGES[data.loyalty.tier] || "bg-slate-500"
                      }`}
                    >
                      {data.loyalty.tier}
                    </Badge>

                    {data.status === "BLOCKED" && (
                      <Badge
                        variant="destructive"
                        className="rounded-none text-[10px] px-1.5 py-0"
                      >
                        Bloqué
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />

                  <span className="truncate">{data.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />

                  <span>{data.phone}</span>
                </div>
              </div>
            </SheetHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  Profil & Statut
                </h4>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Statut du client
                  </Label>

                  <Select
                    value={data.status}
                    onValueChange={(status) => {
                      if (!status) return;

                      setData({
                        ...data,
                        status,
                      });
                    }}
                  >
                    <SelectTrigger className="rounded-none h-9 text-xs border-slate-200 focus:ring-slate-400">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>

                    <SelectContent className="rounded-none">
                      <SelectItem value="REGULAR">Régulier</SelectItem>

                      <SelectItem value="VIP">VIP</SelectItem>

                      <SelectItem
                        value="BLOCKED"
                        className="text-rose-600 font-semibold"
                      >
                        Bloqué
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  Fidélité & Avantages
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">
                      Niveau
                    </Label>

                    <Select
                      value={data.loyalty.tier}
                      onValueChange={(tier) => {
                        if (!tier) return;

                        setData({
                          ...data,
                          loyalty: {
                            ...data.loyalty,
                            tier,
                          },
                        });
                      }}
                    >
                      <SelectTrigger className="rounded-none h-9 text-xs border-slate-200">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="rounded-none">
                        <SelectItem value="BRONZE">Bronze</SelectItem>

                        <SelectItem value="SILVER">Silver</SelectItem>

                        <SelectItem value="GOLD">Gold</SelectItem>

                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">
                      Points cumulés
                    </Label>

                    <Input
                      type="number"
                      value={data.loyalty.points}
                      onChange={(e) => {
                        const points = Number(e.target.value);
                        setData((prev) => ({
                          ...prev,
                          loyalty: {
                            ...prev.loyalty,
                            points,
                            tier: computeTier(points),
                          },
                        }));
                      }}
                      className="rounded-none h-9 text-xs border-slate-200"
                    />
                  </div>
                </div>

                {/* REMISE */}

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Remise spéciale (%)
                  </Label>

                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={data.loyalty.customDiscountPercent ?? ""}
                    onChange={(e) => {
                      setData({
                        ...data,
                        loyalty: {
                          ...data.loyalty,
                          customDiscountPercent:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        },
                      });
                    }}
                    placeholder="Ex: 10 pour 10%"
                    className="rounded-none h-9 text-xs border-slate-200"
                  />
                </div>
              </div>

              {data.stats && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Historique d&apos;activité
                  </h4>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 border border-slate-100 text-center">
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">
                        Commandes
                      </span>

                      <span className="text-xs font-bold text-slate-800">
                        {data.stats.totalOrders}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">
                        Dépenses
                      </span>

                      <span className="text-xs font-bold text-slate-800">
                        {formatAr(data.stats.totalSpent)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">
                        No-Shows
                      </span>

                      <span className="text-xs font-bold text-rose-600">
                        {data.stats.noShowCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center justify-end gap-2 w-full">
              <SheetClose
                render={
                  <Button
                    className="rounded-none text-xs h-9 border-slate-200"
                    variant="outline"
                  >
                    Annuler
                  </Button>
                }
              />

              <Button
                onClick={() => setShowConfirm(true)}
                disabled={saving}
                className="rounded-none text-xs h-9 bg-slate-900 text-white hover:bg-slate-800"
              >
                {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        open={showConfirm}
        title="Confirmer les modifications"
        description={`Confirmer la mise à jour du client « ${data.firstName} ${data.lastName} » ?`}
        confirmLabel="Enregistrer"
        onConfirm={handleSave}
        onOpenChange={(openValue) => {
          if (!openValue) setShowConfirm(false);
        }}
      />
    </>
  );
};
