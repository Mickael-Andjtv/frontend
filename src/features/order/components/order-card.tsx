"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "../types/order-types";
import {
  Check,
  X,
  Clock,
  Utensils,
  ShoppingBag,
  Truck,
  CreditCard,
  Banknote,
  ChefHat,
  CheckCircle2,
  MessageSquareQuote,
} from "lucide-react";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { formatAr } from "@/lib/money";

type Props = {
  order: Order;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void;
  isFocused?: boolean;
};

const OrderCardComponent = ({
  order,
  onAccept,
  onReject,
  onStatusChange,
  isFocused = false,
}: Props) => {
  const [showReject, setShowReject] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    status: Order["status"];
  } | null>(null);
  const initials = `${order.customer.firstName?.[0] || ""}${
    order.customer.lastName?.[0] || ""
  }`.toUpperCase();

  const formattedTime = new Date(order.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderTypeBadge = () => {
    switch (order.type) {
      case "EAT_IN":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            Sur place {order.tableNumber && `(${order.tableNumber})`}
          </Badge>
        );
      case "TAKEAWAY":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            À emporter
          </Badge>
        );
      case "DELIVERY":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Livraison
          </Badge>
        );
    }
  };

  const renderStatusBadge = () => {
    switch (order.status) {
      case "PENDING":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">En attente</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-600">Confirmée</Badge>;
      case "PREPARING":
        return <Badge className="bg-orange-500">En cuisine</Badge>;
      case "READY":
        return <Badge className="bg-emerald-500">Prête</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-600">Terminée</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Annulée</Badge>;
    }
  };

  return (
    <Card className={`w-full max-w-md shadow-md border-slate-200 overflow-hidden flex flex-col justify-between ${isFocused ? "ring-2 ring-sky-500" : ""}`}>
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-800">
                {order.orderNumber}
              </span>
              {renderTypeBadge()}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{formattedTime}</span>
            </div>
          </div>
          {renderStatusBadge()}
        </div>

        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-200/60">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={order.customer.image}
              alt={`${order.customer.firstName} ${order.customer.lastName}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-800 text-white font-medium text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              {order.customer.status === "VIP" && (
                <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded">
                  VIP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {order.customer.phone}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 flex-1">
        <div className="space-y-3">
          {order.items.map((it) => {
            const menu = it.menuItem;
            return (
              <div
                key={it.id}
                className="flex items-center gap-3 pb-2 border-b border-slate-100 last:border-b-0 last:pb-0"
              >
                <div className="relative h-12 w-12 overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  {menu.imageUrl[0] && (
                    // eslint-disable-next-line @next/next/no-img-element -- backend http images unsupported by next/image optimizer
                    <img
                      src={menu.imageUrl[0]}
                      alt={menu.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-1 rounded-tl-md">
                    x{it.quantity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 truncate">
                    {menu.name}
                  </h4>
                  {it.notes && (
                    <p className="text-xs  px-1.5 py-0.5 rounded border-dashed border-2 border-gray-900 lowercase  mt-0.5 flex items-center gap-1 italic">
                      <MessageSquareQuote className="w-3 h-3 shrink-0" />
                      {it.notes}
                    </p>
                  )}
                </div>

                <div className="text-sm font-semibold text-slate-700">
                  {formatAr(menu.price * it.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* FOOTER : Total & Boutons d'Action Admin */}
      <CardFooter className="bg-slate-50 border-t border-slate-100 pt-3 flex flex-col gap-3">
        {/* Ligne Total & Méthode de paiement */}
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} articles</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              {order.paymentMethod === "CARD" ? (
                <CreditCard className="w-3 h-3" />
              ) : (
                <Banknote className="w-3 h-3" />
              )}
              {order.paymentStatus === "PAID" ? "Payé" : "À encaisser"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatAr(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Boutons d'action dynamiques selon le statut */}
        <div className="w-full pt-1">
          {order.status === "PENDING" && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="destructive"
                className="w-full gap-1"
                onClick={() => setShowReject(true)}
              >
                <X className="w-4 h-4" /> Refuser
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                onClick={() =>
                  setPendingStatus({
                    title: "Accepter la commande",
                    description: `Confirmer l'acceptation de la commande ${order.orderNumber} pour ${order.customer.firstName} ${order.customer.lastName} ?`,
                    confirmLabel: "Accepter",
                    status: "CONFIRMED",
                  })
                }
              >
                <Check className="w-4 h-4" /> Accepter
              </Button>
            </div>
          )}

          {order.status === "CONFIRMED" && (
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2"
              onClick={() =>
                setPendingStatus({
                  title: "Envoyer en cuisine",
                  description: `Confirmer l'envoi en cuisine de la commande ${order.orderNumber} ?`,
                  confirmLabel: "Envoyer en cuisine",
                  status: "PREPARING",
                })
              }
            >
              <ChefHat className="w-4 h-4" /> Envoyer en cuisine
            </Button>
          )}

          {order.status === "PREPARING" && (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() =>
                setPendingStatus({
                  title: "Marquer comme prête",
                  description: `Confirmer que la commande ${order.orderNumber} est prête ?`,
                  confirmLabel: "Marquer comme prête",
                  status: "READY",
                })
              }
            >
              <CheckCircle2 className="w-4 h-4" /> Marquer comme Prête
            </Button>
          )}

          {order.status === "READY" && (
            <Button
              className="w-full bg-slate-800 hover:bg-slate-900 text-white gap-2"
              onClick={() =>
                setPendingStatus({
                  title: "Clôturer la commande",
                  description: `Confirmer la clôture de la commande ${order.orderNumber} pour ${order.customer.firstName} ${order.customer.lastName} (${formatAr(order.totalAmount)}) ?`,
                  confirmLabel: "Clôturer",
                  status: "COMPLETED",
                })
              }
            >
              <Check className="w-4 h-4" /> Clôturer la commande
            </Button>
          )}

          {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
            <div className="text-center text-xs text-slate-400 py-1 italic">
              Commande fermée ({order.status === "COMPLETED" ? "Terminée" : "Annulée"})
            </div>
          )}
        </div>
      </CardFooter>

      <ConfirmModal
        open={showReject}
        title="Refuser la commande"
        description={`Confirmer le refus de la commande ${order.orderNumber} pour ${order.customer.firstName} ${order.customer.lastName} (${formatAr(order.totalAmount)}) ?`}
        confirmLabel="Refuser"
        destructive
        onConfirm={() => onReject?.(order.id)}
        onOpenChange={setShowReject}
      />

      <ConfirmModal
        open={pendingStatus !== null}
        title={pendingStatus?.title ?? ""}
        description={pendingStatus?.description ?? ""}
        confirmLabel={pendingStatus?.confirmLabel ?? "Confirmer"}
        onConfirm={() => {
          const target = pendingStatus?.status;
          if (!target) return;
          if (target === "CONFIRMED") onAccept?.(order.id);
          else onStatusChange?.(order.id, target);
          setPendingStatus(null);
        }}
        onOpenChange={(openValue) => {
          if (!openValue) setPendingStatus(null);
        }}
      />
    </Card>
  );
};

export default OrderCardComponent;