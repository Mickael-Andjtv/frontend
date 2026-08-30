import React, { useState } from "react";
import { Plus, Minus, Leaf } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItem } from "../types/menu.types";
import { BaseMenuCard } from "./base-menu-card";

type Props = {
  menuItem: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
};

export const MenuCardClient = ({ menuItem, onAddToCart }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = menuItem.status === "OUT_OF_STOCK";

  const badges = (
    <>
      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
        {isOutOfStock && <Badge variant="destructive">Épuisé</Badge>}
        {menuItem.isVegetarian && (
          <Badge className="bg-emerald-700 text-white gap-1">
            <Leaf className="w-3 h-3" /> Végétarien
          </Badge>
        )}
      </div>

      {menuItem.optionGroups && menuItem.optionGroups.length > 0 && (
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-xs">
            {menuItem.optionGroups.length}{" "}
            {menuItem.optionGroups.length > 1 ? "groupes" : "groupe"}
          </Badge>
        </div>
      )}
    </>
  );

  const footer = (
    <CardFooter className="p-4 pt-0 flex items-center justify-between gap-3 border-t border-slate-50 mt-auto">
      <div className="flex items-center border border-slate-200 rounded-md">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-none"
          onClick={() => setQuantity((p) => Math.max(1, p - 1))}
          disabled={isOutOfStock || quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-xs font-semibold">
          {quantity}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-none"
          onClick={() => setQuantity((p) => p + 1)}
          disabled={isOutOfStock}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        onClick={() => onAddToCart?.(menuItem, quantity)}
        disabled={isOutOfStock}
        className="flex-1 bg-white border-2 border-gray-900  hover:bg-slate-800 hover:text-white text-gray-900 text-xs h-9"
      >
        Commander
      </Button>
    </CardFooter>
  );

  return (
    <BaseMenuCard
      menuItem={menuItem}
      headerBadges={badges}
      footerActions={footer}
      imageClassName="hover:scale-105"
    />
  );
};
