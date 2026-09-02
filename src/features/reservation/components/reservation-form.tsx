"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import type { Customer } from "@/features/client/types/client.types";
import type { CreateReservationPayload } from "@/services/reservations";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

type Props = {
  triggerBtn?: React.ReactElement;
  customers: Customer[];
  tables: RestaurantTable[];
  onSubmit?: (payload: CreateReservationPayload) => void;
};

export function ReservationFormSheet({
  triggerBtn,
  customers,
  tables,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [reservationDate, setReservationDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reservationTime, setReservationTime] = useState("12:00 PM");
  const [tableId, setTableId] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("2");
  const [specialRequest, setSpecialRequest] = useState("");

  const resetForm = () => {
    setCustomerId("");
    setReservationDate(new Date().toISOString().slice(0, 10));
    setReservationTime("12:00 PM");
    setTableId("");
    setNumberOfGuests("2");
    setSpecialRequest("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    onSubmit?.({
      customerId,
      reservationDate,
      reservationTime,
      numberOfGuests: parseInt(numberOfGuests, 10) || 2,
      tableId: tableId || null,
      specialRequest: specialRequest.trim() || null,
    });
    resetForm();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {triggerBtn && <SheetTrigger render={triggerBtn} />}
      <SheetContent className="p-0 sm:max-w-md rounded-none">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full max-h-screen"
        >
          <SheetHeader className="p-4 border-b shrink-0">
            <SheetTitle className="text-xl font-bold">
              Nouvelle réservation
            </SheetTitle>
            <SheetDescription className="text-xs">
              Planifiez une réservation pour un client existant.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="reservation-customer">Client</Label>
              <Select value={customerId} onValueChange={(v) => v !== null && setCustomerId(v)}>
                <SelectTrigger className="rounded-none w-full" id="reservation-customer">
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {customers.map((customer) => (
                    <SelectItem
                      className="rounded-none"
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.firstName} {customer.lastName} ·{" "}
                      {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reservation-date">Date</Label>
                <Input
                  id="reservation-date"
                  type="date"
                  className="rounded-none"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reservation-time">Créneau</Label>
                <Select value={reservationTime} onValueChange={(v) => v !== null && setReservationTime(v)}>
                  <SelectTrigger className="rounded-none w-full" id="reservation-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem
                        className="rounded-none"
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reservation-guests">Couverts</Label>
                <Input
                  id="reservation-guests"
                  type="number"
                  min={1}
                  className="rounded-none"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reservation-table">Table</Label>
                <Select value={tableId} onValueChange={(v) => v !== null && setTableId(v)}>
                  <SelectTrigger className="rounded-none w-full" id="reservation-table">
                    <SelectValue placeholder="À attribuer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {tables.map((table) => (
                      <SelectItem
                        className="rounded-none"
                        key={table.id}
                        value={table.id}
                      >
                        Table {table.num} · {table.capacity} pers.
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reservation-request">Demande spéciale</Label>
              <Textarea
                id="reservation-request"
                rows={3}
                placeholder="Allergies, préférences..."
                className="rounded-none"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="p-4 border-t shrink-0 flex gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!customerId}
            >
              Créer la réservation
            </Button>
            <SheetClose
              render={
                <Button variant="outline" className="w-full" type="button">
                  Annuler
                </Button>
              }
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}