"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RestaurantTable, TableStatus } from "../types/table";
import TableCard from "./table-card";
import { naturalCompare } from "@/lib/utils";

type Props = {
  restaurantTables: RestaurantTable[];
  onUpdateTable?: (table: RestaurantTable) => void;
  onUpdateStatus?: (id: string, status: TableStatus) => void;
  onDeleteTable?: (id: string) => void;
};

const ListTable = ({ restaurantTables, onUpdateTable, onUpdateStatus, onDeleteTable }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<number | "ALL">("ALL");

  const filteredTables = useMemo(() => {
    return restaurantTables
      .filter((table) => {
        const query = searchQuery.toLowerCase().trim();
        const searchNum = parseInt(query, 10);

        const matchesSearch =
          !query || (!isNaN(searchNum) && table.num === searchNum);

        const matchesCapacity =
          capacityFilter === "ALL" || table.capacity === capacityFilter;

        return matchesSearch && matchesCapacity;
      })
      .sort((a, b) => naturalCompare(a.num, b.num));
  }, [restaurantTables, searchQuery, capacityFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setCapacityFilter("ALL");
  };

  const hasActiveFilters = searchQuery !== "" || capacityFilter !== "ALL";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par N° de table..."
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

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" /> Capacité :
          </span>

          <Badge
            variant={capacityFilter === "ALL" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCapacityFilter("ALL")}
          >
            Toutes
          </Badge>
          <Badge
            variant={capacityFilter === 2 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              setCapacityFilter(capacityFilter === 2 ? "ALL" : 2)
            }
          >
            2 personnes
          </Badge>
          <Badge
            variant={capacityFilter === 4 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              setCapacityFilter(capacityFilter === 4 ? "ALL" : 4)
            }
          >
            4 personnes
          </Badge>
          <Badge
            variant={capacityFilter === 6 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              setCapacityFilter(capacityFilter === 6 ? "ALL" : 6)
            }
          >
            6+ personnes
          </Badge>
        </div>
      </div>

      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              resTable={table}
              onUpdateTable={onUpdateTable}
              onUpdateStatus={onUpdateStatus}
              onDeleteTable={onDeleteTable}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">
            Aucune table ne correspond à vos critères.
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

export default ListTable;