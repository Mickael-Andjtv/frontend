import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MenuItem } from "../types/menu.types";

type BaseMenuCardProps = {
  menuItem: MenuItem;
  headerBadges?: React.ReactNode;
  footerActions: React.ReactNode;
  imageClassName?: string;
};

export const BaseMenuCard = ({
  menuItem,
  headerBadges,
  footerActions,
  imageClassName = "",
}: BaseMenuCardProps) => {
  return (
    <Card className="overflow-hidden  pt-0 flex flex-col justify-between h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <CardHeader className="p-0 rounded-none relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={menuItem.imageUrl}
            alt={menuItem.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${imageClassName}`}
          />
          {headerBadges}
        </CardHeader>

        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-slate-900 line-clamp-1">
              {menuItem.name}
            </h3>
            <span className="font-bold text-gray-900 text-base">
              {menuItem.price.toFixed(2)} €
            </span>
          </div>

          {menuItem.description && (
            <p className="text-xs text-slate-500 line-clamp-2">
              {menuItem.description}
            </p>
          )}

          {menuItem.preparationTimeMinutes && (
            <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-1">
              <Clock className="w-3 h-3" />
              <span>{menuItem.preparationTimeMinutes} min</span>
            </div>
          )}
        </CardContent>
      </div>

      {footerActions}
    </Card>
  );
};
