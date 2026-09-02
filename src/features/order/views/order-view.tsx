"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListOrderComponent from "../components/list-order";
import { getOrders, updateOrderStatus } from "@/services/orders";
import type { Order } from "../types/order-types";

const OrderView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "amount-desc"
  >("date-desc");

  const loadOrders = async () => {
    try {
      const fetched = await getOrders();
      setOrders(fetched);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Impossible de charger les commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getOrders()
      .then((fetched) => {
        setOrders(fetched);
        setLoadError(null);
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Impossible de charger les commandes"),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (ord) => ord.status !== "CANCELLED" && ord.status !== "COMPLETED",
    );
  }, [orders]);

  const filteredHistoryOrders = useMemo(() => {
    return orders.filter((ord) => {
      const isHistory =
        ord.status === "CANCELLED" || ord.status === "COMPLETED";
      if (!isHistory) return false;

      const query = searchQuery.toLowerCase().trim();
      const fullName =
        `${ord.customer?.firstName ?? ""} ${ord.customer?.lastName ?? ""}`.toLowerCase();
      const orderNum = (ord.orderNumber ?? "").toLowerCase();
      const phone = ord.customer?.phone ?? "";

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        orderNum.includes(query) ||
        phone.includes(query);

      const matchesStatus =
        selectedStatus === "ALL" || ord.status === selectedStatus;

      const matchesType = selectedType === "ALL" || ord.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      if (sortBy === "amount-desc") {
        return (b.totalAmount ?? 0) - (a.totalAmount ?? 0);
      }
      if (sortBy === "date-asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, searchQuery, selectedStatus, selectedType, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedType("ALL");
    setSortBy("date-desc");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedStatus !== "ALL" ||
    selectedType !== "ALL" ||
    sortBy !== "date-desc";

  const applyStatus = useCallback(
    async (orderId: string, newStatus: Order["status"], successMessage: string) => {
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success(successMessage);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    },
    [],
  );

  const handleAccept = useCallback(
    (orderId: string) => applyStatus(orderId, "CONFIRMED", "Commande acceptée"),
    [applyStatus],
  );

  const handleReject = useCallback(
    (orderId: string) => applyStatus(orderId, "CANCELLED", "Commande refusée"),
    [applyStatus],
  );

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: Order["status"]) =>
      applyStatus(orderId, newStatus, `Statut mis à jour : ${newStatus}`),
    [applyStatus],
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Commandes</h1>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">{loadError}</p>
          <button onClick={loadOrders} className="mt-3 text-xs text-slate-700 underline">
            Réessayer
          </button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line">
            <TabsTrigger value="active" className={"cursor-pointer"}>
              En cours ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history" className={"cursor-pointer"}>
              Historique ({filteredHistoryOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="pt-4">
            {activeOrders.length > 0 ? (
              <ListOrderComponent
                orders={activeOrders}
                onAccept={handleAccept}
                onReject={handleReject}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-none">
                <p className="text-slate-500 text-sm">
                  Aucune commande en cours.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4 space-y-6">
            <div className="flex flex-col gap-4 bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom, N° commande..."
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
                      val: "date-desc" | "date-asc" | "amount-desc" | null,
                    ) => {
                      if (val) setSortBy(val);
                    }}
                  >
                    <SelectTrigger className="w-48 rounded-none">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="date-desc" className="rounded-none">
                        Plus récents
                      </SelectItem>
                      <SelectItem value="date-asc" className="rounded-none">
                        Plus anciens
                      </SelectItem>
                      <SelectItem value="amount-desc" className="rounded-none">
                        Montant (€) décroissant
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
                  <SlidersHorizontal className="w-3 h-3" /> Type :
                </span>

                <Badge
                  variant={selectedType === "ALL" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType("ALL")}
                >
                  Tous
                </Badge>
                <Badge
                  variant={selectedType === "EAT_IN" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedType(selectedType === "EAT_IN" ? "ALL" : "EAT_IN")
                  }
                >
                  Sur place
                </Badge>
                <Badge
                  variant={selectedType === "TAKEAWAY" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedType(
                      selectedType === "TAKEAWAY" ? "ALL" : "TAKEAWAY",
                    )
                  }
                >
                  À emporter
                </Badge>
                <Badge
                  variant={selectedType === "DELIVERY" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedType(
                      selectedType === "DELIVERY" ? "ALL" : "DELIVERY",
                    )
                  }
                >
                  Livraison
                </Badge>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <span className="text-xs font-medium text-slate-500 mr-1">
                  Statut :
                </span>

                <Badge
                  variant={selectedStatus === "ALL" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus("ALL")}
                >
                  Tous
                </Badge>
                <Badge
                  variant={selectedStatus === "COMPLETED" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedStatus === "COMPLETED"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedStatus(
                      selectedStatus === "COMPLETED" ? "ALL" : "COMPLETED",
                    )
                  }
                >
                  Terminées
                </Badge>
                <Badge
                  variant={selectedStatus === "CANCELLED" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedStatus === "CANCELLED"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedStatus(
                      selectedStatus === "CANCELLED" ? "ALL" : "CANCELLED",
                    )
                  }
                >
                  Annulées
                </Badge>
              </div>
            </div>

            {filteredHistoryOrders.length > 0 ? (
              <ListOrderComponent orders={filteredHistoryOrders} />
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-none">
                <p className="text-slate-500 text-sm">
                  Aucune commande ne correspond à vos critères d&apos;historique.
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default OrderView;