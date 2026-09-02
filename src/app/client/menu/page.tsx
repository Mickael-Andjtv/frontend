"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Leaf,
  WheatOff,
  CircleAlert,
  Search,
} from "lucide-react";
import { getMenuItems } from "@/services/menu";
import { getCategories } from "@/services/categories";
import type { MenuItem } from "@/features/menu/types/menu.types";
import { useCart } from "@/features/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const currency = (value: number) => `${value.toLocaleString("fr-FR")} Ar`;

export default function ClientMenuPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const loadMenu = useCallback(() => {
    Promise.all([getMenuItems(), getCategories()])
      .then(([menuItems, categories]) => {
        const available = menuItems.filter(
          (item) => item.status === "AVAILABLE",
        );
        setItems(available);
        setCategories(categories.map((c) => ({ id: c.id, name: c.name })));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.categoryId === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center">
        <CircleAlert className="h-10 w-10 text-muted-foreground" />
        <p>Une erreur est survenue lors du chargement du menu.</p>
        <Button
          variant="outline"
          onClick={() => {
            setError(false);
            setLoading(true);
            loadMenu();
          }}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notre menu</h1>
          <p className="text-sm text-muted-foreground">
            Des plats frais et savoureux, préparés sur commande.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            selectedCategory === "ALL"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            Aucun plat ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {item.imageUrl?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl[0]}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground/40">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  {item.isVegetarian && (
                    <Badge className="gap-1 bg-green-600/90 text-white">
                      <Leaf className="h-3 w-3" /> Végé
                    </Badge>
                  )}
                  {item.isGlutenFree && (
                    <Badge className="gap-1 bg-amber-600/90 text-white">
                      <WheatOff className="h-3 w-3" /> Sans gluten
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-lg font-bold">
                    {currency(item.price)}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    addItem(item);
                    toast.success(`${item.name} ajouté au panier`);
                  }}
                >
                  <Plus className="h-4 w-4" /> Ajouter au panier
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}