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
import { Customer } from "../types/client.types";
import ClientCardComponent from "./client-card";
import { CustomerDetailsSheet } from "./client-detail";

type Props = {
  clients: Customer[];
  onUpdateCustomer?: (customer: Customer) => void;
};

const ListClientComponent = ({ clients, onUpdateCustomer }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [isVegetarianOnly, setIsVegetarianOnly] = useState(false);
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState(false);
  const [hasAllergiesOnly, setHasAllergiesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "spent-desc" | "orders-desc">(
    "name",
  );

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query);

        const matchesStatus =
          selectedStatus === "ALL" || client.status === selectedStatus;

        const matchesTier =
          selectedTier === "ALL" || client.loyalty.tier === selectedTier;

        const matchesVeg =
          !isVegetarianOnly || client.preferences?.isVegetarian;

        const matchesGF = !isGlutenFreeOnly || client.preferences?.isGlutenFree;

        const matchesAllergies =
          !hasAllergiesOnly ||
          (client.preferences?.allergies &&
            client.preferences.allergies.length > 0);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTier &&
          matchesVeg &&
          matchesGF &&
          matchesAllergies
        );
      })
      .sort((a, b) => {
        if (sortBy === "spent-desc") {
          return (b.stats?.totalSpent ?? 0) - (a.stats?.totalSpent ?? 0);
        }
        if (sortBy === "orders-desc") {
          return (b.stats?.totalOrders ?? 0) - (a.stats?.totalOrders ?? 0);
        }
        return `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`,
        );
      });
  }, [
    clients,
    searchQuery,
    selectedStatus,
    selectedTier,
    isVegetarianOnly,
    isGlutenFreeOnly,
    hasAllergiesOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedTier("ALL");
    setIsVegetarianOnly(false);
    setIsGlutenFreeOnly(false);
    setHasAllergiesOnly(false);
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedStatus !== "ALL" ||
    selectedTier !== "ALL" ||
    isVegetarianOnly ||
    isGlutenFreeOnly ||
    hasAllergiesOnly;


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email, tél..."
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
                val: "name" | "spent-desc" | "orders-desc" | null,
              ) => {
                if (val) setSortBy(val);
              }}
            >
              <SelectTrigger className="w-48 rounded-none">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="name" className="rounded-none">
                  Nom (A-Z)
                </SelectItem>
                <SelectItem value="spent-desc" className="rounded-none">
                  Dépenses (Ar) décroissantes
                </SelectItem>
                <SelectItem value="orders-desc" className="rounded-none">
                  Nombre de commandes
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
            <SlidersHorizontal className="w-3 h-3" /> Statuts:
          </span>

          <Badge
            variant={selectedStatus === "ALL" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStatus("ALL")}
          >
            Tous
          </Badge>
          <Badge
            variant={selectedStatus === "REGULAR" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStatus("REGULAR")}
          >
            Régulier
          </Badge>
          <Badge
            variant={selectedStatus === "VIP" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStatus("VIP")}
          >
            VIP
          </Badge>
          <Badge
            variant={selectedStatus === "BLOCKED" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStatus("BLOCKED")}
          >
            Bloqué
          </Badge>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <span className="text-xs font-medium text-slate-500 mr-1">
            Fidélité:
          </span>
          {["BRONZE", "SILVER", "GOLD", "VIP"].map((tier) => (
            <Badge
              key={tier}
              variant={selectedTier === tier ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                setSelectedTier(selectedTier === tier ? "ALL" : tier)
              }
            >
              {tier}
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

          <Badge
            variant={hasAllergiesOnly ? "default" : "outline"}
            className={`cursor-pointer ${
              hasAllergiesOnly
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : ""
            }`}
            onClick={() => setHasAllergiesOnly(!hasAllergiesOnly)}
          >
            Avec Allergie(s)
          </Badge>
        </div>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClients.map((client) => (
            <CustomerDetailsSheet
              key={client.id}
              customer={client}
              detail={<ClientCardComponent customer={client} />}
              onUpdate={onUpdateCustomer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none">
          <p className="text-slate-500 text-sm">
            Aucun client ne correspond à vos critères.
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

export default ListClientComponent;
