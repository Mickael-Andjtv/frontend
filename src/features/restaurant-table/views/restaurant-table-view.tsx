"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ListTable from "../components/list";
import AddTable from "./add-table";
import { getTables, createTable, updateTable, deleteTable, updateTableStatus } from "@/services/tables";
import type { RestaurantTable, TableStatus } from "../types/table";
import { naturalCompare } from "@/lib/utils";

const sortTables = (tables: RestaurantTable[]) =>
  [...tables].sort((a, b) => naturalCompare(a.num, b.num));

const RestaurantTableView = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTables = async () => {
    try {
      const fetched = await getTables();
      setTables(sortTables(fetched));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getTables()
      .then((fetched) => {
        setTables(sortTables(fetched));
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger les tables"),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleCreateTable = async (table: RestaurantTable) => {
      try {
        await createTable({ num: table.num, capacity: table.capacity, place: table.place });
        toast.success("Table ajoutée avec succès");
        await loadTables();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      }
    };

    const handleUpdateTable = async (table: RestaurantTable) => {
      try {
        await updateTable(table.id, {
          num: table.num,
          capacity: table.capacity,
          place: table.place,
        });
        toast.success("Table mise à jour");
        await loadTables();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    };

    const handleUpdateTableStatus = async (id: string, status: TableStatus) => {
      try {
        await updateTableStatus(id, status);
        toast.success("Statut de la table mis à jour");
        await loadTables();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors du changement de statut");
      }
    };

    const handleDeleteTable = async (id: string) => {
      try {
        await deleteTable(id);
        toast.success("Table supprimée");
        await loadTables();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center m-2">
        <h1 className="text-xl font-bold">Tables</h1>
        <AddTable onCreate={handleCreateTable} />
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">{error}</p>
          <button onClick={loadTables} className="mt-3 text-xs text-slate-700 underline">
            Réessayer
          </button>
        </div>
      ) : (
        <ListTable
          restaurantTables={tables}
          onUpdateTable={handleUpdateTable}
          onUpdateStatus={handleUpdateTableStatus}
          onDeleteTable={handleDeleteTable}
        />
      )}
    </div>
  );
};

export default RestaurantTableView;