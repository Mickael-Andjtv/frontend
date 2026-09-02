"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  LogOut,
  Save,
  Loader2,
  Crown,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { updateCustomer } from "@/services/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ClientProfilePage() {
  const { customer, logout, refresh } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [saving, setSaving] = useState(false);

  if (!customer) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const initials =
    customer.firstName?.[0] && customer.lastName?.[0]
      ? `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
      : "?";

  const handleSave = async () => {
    if (!firstName || !lastName) {
      toast.error("Le prénom et le nom sont requis.");
      return;
    }
    setSaving(true);
    try {
      await updateCustomer(customer.id, { firstName, lastName, phone });
      await refresh();
      toast.success("Profil mis à jour.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de mettre à jour.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Mon profil</h1>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {initials}
          </span>
          <div>
            <p className="text-lg font-semibold">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> {customer.email}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Crown className="h-4 w-4" /> Programme fidélité :{" "}
              <span className="font-semibold text-foreground">
                {customer.loyalty.tier}
              </span>{" "}
              · {customer.loyalty.points} points
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first">Prénom</Label>
              <Input
                id="first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Nom</Label>
              <Input
                id="last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={customer.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="mr-1 inline h-3.5 w-3.5" />
              Téléphone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+261 34 ..."
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Enregistrer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Déconnexion</p>
              <p className="text-xs text-muted-foreground">
                Vous serez redirigé vers la page d&apos;accueil.
              </p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}