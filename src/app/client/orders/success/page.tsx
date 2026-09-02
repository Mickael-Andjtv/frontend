"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Loader2, Receipt, UtensilsCrossed, ArrowRight, Download } from "lucide-react";
import { getClientOrder } from "@/features/client/services/client-orders";
import type { Order } from "@/features/order/types/order-types";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadInvoice } from "@/services/invoices";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(orderId === null);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    getClientOrder(orderId)
      .then((o) => active && setOrder(o))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-lg font-medium">Commande introuvable</p>
        <ButtonLink href="/client/orders">Voir mes commandes</ButtonLink>
      </div>
    );
  }

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/client/orders?focus=${order.id}`
      : order.id;
  const qrValue = JSON.stringify({ orderId: order.id, orderNumber: order.orderNumber, tracking: trackingUrl });

  const handleDownload = async () => {
    try {
      const blob = await downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Facture téléchargée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du téléchargement");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="text-2xl font-bold">Commande confirmée 🎉</h1>
        <p className="text-muted-foreground">
          Votre commande{" "}
          <span className="font-semibold text-foreground">
            #{order.orderNumber}
          </span>{" "}
          a bien été enregistrée.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <QRCodeSVG value={qrValue} size={200} level="M" includeMargin />
          <p className="text-sm text-muted-foreground">
            Présentez ce QR Code au personnel si nécessaire.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3 rounded-xl border p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Numéro</span>
          <span className="font-semibold">{order.orderNumber}</span>
        </div>
        {order.tableNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Table</span>
            <span className="font-semibold">{order.tableNumber}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Statut</span>
          <span className="font-semibold uppercase">{order.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold">
            {order.totalAmount.toLocaleString("fr-FR")} Ar
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/client/orders">
          Suivre ma commande <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" /> Télécharger la facture
        </Button>
        <ButtonLink href="/client/menu" variant="outline">
          <UtensilsCrossed className="h-4 w-4" /> Commander encore
        </ButtonLink>
      </div>
    </div>
  );
}