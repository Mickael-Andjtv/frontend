"use client";

import { useState } from "react";
import { EyeOff, Layers, Edit, Trash2 } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "../types/menu.types";
import { BaseMenuCard } from "./base-menu-card";
import { MenuFormSheet } from "./menu-form";
import { ConfirmModal } from "@/components/layout/confirm-modal";

type PropsAdmin = {
  menuItem: MenuItem;
  categories?: { id: string; name: string }[];
  onEditSubmit?: (
    data: Partial<MenuItem> & { imageFiles?: File[]; existingUrls?: string[] },
  ) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, isAvailable: boolean) => void;
};

export const MenuCardAdmin = ({
  menuItem,
  categories = [],
  onEditSubmit,
  onDelete,
  onToggleStatus,
}: PropsAdmin) => {
  const isAvailable = menuItem.status === "AVAILABLE";
  const optionGroupsCount = menuItem.optionGroups?.length ?? 0;
  const [showDelete, setShowDelete] = useState(false);

  const badges = (
    <>
      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
        {menuItem.status === "HIDDEN" && (
          <Badge variant="secondary" className="gap-1 bg-slate-900 text-white">
            <EyeOff className="w-3 h-3" /> Masqué
          </Badge>
        )}
        {menuItem.status === "OUT_OF_STOCK" && (
          <Badge variant="destructive">Rupture</Badge>
        )}
      </div>

      {optionGroupsCount > 0 && (
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-xs gap-1">
            <Layers className="w-3 h-3" />
            {optionGroupsCount} {optionGroupsCount > 1 ? "groupes" : "groupe"}
          </Badge>
        </div>
      )}
    </>
  );

  const footer = (
    <CardFooter className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={isAvailable}
          onCheckedChange={(checked) => onToggleStatus?.(menuItem.id, checked)}
        />
        <span className="text-[11px] font-medium text-slate-600">
          {isAvailable ? "En stock" : "Épuisé"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <MenuFormSheet
          key={menuItem.id}
          initialData={menuItem}
          categories={categories}
          onSubmit={onEditSubmit}
          triggerBtn={
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-600 hover:text-slate-900"
            >
              <Edit className="h-4 w-4" />
            </Button>
          }
        />

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  );

  return (
    <>
      <BaseMenuCard
        menuItem={menuItem}
        headerBadges={badges}
        footerActions={footer}
        imageClassName={!isAvailable ? "grayscale contrast-75 opacity-60" : ""}
      />
      <ConfirmModal
        open={showDelete}
        title="Supprimer le plat"
        description={`Confirmer la suppression de « ${menuItem.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => onDelete?.(menuItem.id)}
        onOpenChange={setShowDelete}
      />
    </>
  );
};
