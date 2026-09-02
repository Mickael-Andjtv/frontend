"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import MenuListComponent from "../components/menu-list";
import AddMenuView from "./add-menu-view";
import { getCategories } from "@/services/categories";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, updateMenuItemStatus } from "@/services/menu";
import type { CategoryOption, MenuItemPayload } from "@/services/menu";
import type { MenuItem } from "../types/menu.types";

type Props = {
  isAdmin: boolean;
};

const MenuView = ({ isAdmin }: Props) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [items, fetchedCategories] = await Promise.all([
        getMenuItems(),
        getCategories(),
      ]);
      setMenuItems(items);
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getMenuItems(), getCategories()])
      .then(([items, fetchedCategories]) => {
        setMenuItems(items);
        setCategories(fetchedCategories);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger le menu"),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleCreate = async (data: MenuItemPayload) => {
      try {
        await createMenuItem(data);
        toast.success("Plat ajouté avec succès");
        await loadData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      }
    };

    const handleEdit = async (data: Partial<MenuItem> & { imageFiles?: File[]; existingUrls?: string[] }) => {
      const id = data.id;
      if (!id) return;
      try {
        await updateMenuItem(id, data as MenuItemPayload);
        toast.success("Plat mis à jour");
        await loadData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    };

    const handleDelete = async (id: string) => {
      try {
        await deleteMenuItem(id);
        toast.success("Plat supprimé");
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    };

    const handleToggleStatus = async (id: string, isAvailable: boolean) => {
      try {
        await updateMenuItemStatus(id, isAvailable);
        toast.success(isAvailable ? "Plat disponible" : "Plat en rupture");
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: isAvailable ? "AVAILABLE" : "OUT_OF_STOCK" }
              : item,
          ),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors du changement de statut");
      }
    };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between m-2">
          <h1 className="text-xl font-bold">Menus</h1>
          {isAdmin && <AddMenuView categories={categories} onSubmit={handleCreate} />}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">{error}</p>
          <button onClick={loadData} className="mt-3 text-xs text-slate-700 underline">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between m-2">
        <h1 className="text-xl font-bold">Menus</h1>
        {isAdmin && <AddMenuView categories={categories} onSubmit={handleCreate} />}
      </div>
      <MenuListComponent
        isAdmin={isAdmin}
        menuItems={menuItems}
        categories={categories}
        onEditSubmit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default MenuView;