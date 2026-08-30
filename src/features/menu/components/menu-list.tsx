"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem } from "../types/menu.types";
import { MenuCardAdmin } from "./menu-card-admin";
import { MenuCardClient } from "./menu-card-client";

type CategoryOption = { id: string; name: string };

type Props = {
  menuItems: MenuItem[];
  categories?: CategoryOption[];
  isAdmin?: boolean;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  onEditSubmit?: (
    data: Partial<MenuItem> & { imageFiles?: File[]; existingUrls?: string[] },
  ) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, isAvailable: boolean) => void;
};

const MenuListComponent = ({
  menuItems,
  categories = [],
  isAdmin = false,
  onAddToCart,
  onEditSubmit,
  onDelete,
  onToggleStatus,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isVegetarianOnly, setIsVegetarianOnly] = useState(false);
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">(
    "name",
  );

  const availableCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    const catIds = Array.from(
      new Set(menuItems.map((item) => item.categoryId)),
    );
    return catIds.map((id) => ({ id, name: `Catégorie ${id}` }));
  }, [categories, menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "ALL" || item.categoryId === selectedCategory;

        const matchesVeg = !isVegetarianOnly || item.isVegetarian;
        const matchesGF = !isGlutenFreeOnly || item.isGlutenFree;

        return matchesSearch && matchesCategory && matchesVeg && matchesGF;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [
    menuItems,
    searchQuery,
    selectedCategory,
    isVegetarianOnly,
    isGlutenFreeOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setIsVegetarianOnly(false);
    setIsGlutenFreeOnly(false);
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "ALL" ||
    isVegetarianOnly ||
    isGlutenFreeOnly;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher un plat, ingrédient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8"
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

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Select
              value={sortBy}
              onValueChange={(
                val: "name" | "price-asc" | "price-desc" | null,
              ) => {
                if (val) setSortBy(val);
              }}
            >
              <SelectTrigger className="w-40 rounded-none">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="name" className="rounded-none">
                  Nom (A-Z)
                </SelectItem>
                <SelectItem value="price-asc" className="rounded-none">
                  Prix croissant
                </SelectItem>
                <SelectItem value="price-desc" className="rounded-none">
                  Prix décroissant
                </SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-slate-500 rounded-none hover:text-slate-900"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" /> Catégories:
          </span>

          <Badge
            variant={selectedCategory === "ALL" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("ALL")}
          >
            Toutes
          </Badge>

          {availableCategories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <Badge
            variant={isVegetarianOnly ? "default" : "outline"}
            className={`cursor-pointer ${
              isVegetarianOnly
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : ""
            }`}
            onClick={() => setIsVegetarianOnly(!isVegetarianOnly)}
          >
            Végétarien
          </Badge>

          <Badge
            variant={isGlutenFreeOnly ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setIsGlutenFreeOnly(!isGlutenFreeOnly)}
          >
             Sans Gluten
          </Badge>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) =>
            isAdmin ? (
              <MenuCardAdmin
                key={item.id}
                menuItem={item}
                categories={availableCategories}
                onEditSubmit={onEditSubmit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ) : (
              <MenuCardClient
                key={item.id}
                menuItem={item}
                onAddToCart={onAddToCart}
              />
            ),
          )}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500 text-sm">
            Aucun plat ne correspond à vos critères.
          </p>
          <Button
            variant="link"
            onClick={resetFilters}
            className="mt-2 text-xs"
          >
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuListComponent;
