"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import LabelComponent from "@/components/layout/label";
import type { CreateCustomerPayload } from "@/services/customers";

type Props = {
  triggerBtn?: React.ReactElement;
  onSubmit?: (data: CreateCustomerPayload) => void;
};

export const CustomerFormSheet = ({ triggerBtn, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isVegetarian: false,
    isGlutenFree: false,
    allergies: "",
    preferredTableNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateCustomerPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      preferences: {
        isVegetarian: formData.isVegetarian,
        isGlutenFree: formData.isGlutenFree,
        allergies: formData.allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        preferredTableNotes: formData.preferredTableNotes || undefined,
      },
    };

    onSubmit?.(payload);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      isVegetarian: false,
      isGlutenFree: false,
      allergies: "",
      preferredTableNotes: "",
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {triggerBtn && <SheetTrigger render={triggerBtn} />}
      <SheetContent className="p-0 sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-screen">
          <SheetHeader className="p-4 border-b shrink-0">
            <SheetTitle className="text-xl font-bold">Ajouter un client</SheetTitle>
            <SheetDescription className="text-xs">
              Renseignez les informations du nouveau client.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <LabelComponent required htmfor="firstName" name="Prénom" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <LabelComponent required htmfor="lastName" name="Nom" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <LabelComponent required htmfor="email" name="Email" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <LabelComponent required htmfor="phone" name="Téléphone" />
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 00 00 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <LabelComponent required={false} htmfor="allergies" name="Allergies (séparées par des virgules)" />
                <Input
                  id="allergies"
                  placeholder="Arachides, Lactose..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <LabelComponent required={false} htmfor="notes" name="Notes de table" />
                <Input
                  id="notes"
                  placeholder="Terrasse, fenêtre..."
                  value={formData.preferredTableNotes}
                  onChange={(e) => setFormData({ ...formData, preferredTableNotes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Végétarien</span>
                <Switch
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Sans Gluten</span>
                <Switch
                  checked={formData.isGlutenFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isGlutenFree: checked })}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="p-4 border-t shrink-0 flex gap-2">
            <Button type="submit" className="w-full">
              Ajouter le client
            </Button>
            <SheetClose render={<Button variant="outline" className="w-full">Annuler</Button>} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};