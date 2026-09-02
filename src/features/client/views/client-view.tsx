"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListClientComponent from "../components/list-client";
import { CustomerFormSheet } from "../components/client-form";
import { getCustomers, createCustomer, updateCustomer } from "@/services/customers";
import type { CreateCustomerPayload } from "@/services/customers";
import type { Customer } from "../types/client.types";
import { usePolling } from "@/hooks/usePolling";

type Props = {
  focusId?: string;
};

const ClientView = ({ focusId }: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      const fetched = await getCustomers();
      setCustomers(fetched);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getCustomers()
      .then((fetched) => {
        setCustomers(fetched);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger les clients"),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  usePolling(() => {
    getCustomers()
      .then((fetched) => {
        setCustomers(fetched);
        setError(null);
      })
      .catch(() => {});
  }, 10000);

  const handleCreate = async (data: CreateCustomerPayload) => {
      try {
        await createCustomer(data);
        toast.success("Client ajouté avec succès");
        await loadCustomers();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      }
    };

    const handleUpdate = async (customer: Customer) => {
      try {
        const updated = await updateCustomer(customer.id, {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          image: customer.image ?? null,
          status: customer.status,
          preferences: customer.preferences,
          loyalty: customer.loyalty,
        });
        toast.success("Client mis à jour");
        setCustomers((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center m-2">
        <h1 className="text-xl font-bold">Clients</h1>
        <CustomerFormSheet
          triggerBtn={
            <Button className="border-gray-900 border-2 hover:bg-gray-950 hover:text-white" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          }
          onSubmit={handleCreate}
        />
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
          <button onClick={loadCustomers} className="mt-3 text-xs text-slate-700 underline">
            Réessayer
          </button>
        </div>
      ) : (
        <ListClientComponent clients={customers} onUpdateCustomer={handleUpdate} focusId={focusId} />
      )}
    </div>
  );
};

export default ClientView;