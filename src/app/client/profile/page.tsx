"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Phone,
  LogOut,
  Save,
  Loader2,
  Crown,
  Camera,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { updateCustomer } from "@/services/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ClientProfilePage() {
  const { customer, logout, refresh } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [image, setImage] = useState<string | undefined>(customer?.image);
  const [isVegetarian, setIsVegetarian] = useState(
    customer?.preferences?.isVegetarian ?? false,
  );
  const [isGlutenFree, setIsGlutenFree] = useState(
    customer?.preferences?.isGlutenFree ?? false,
  );
  const [allergies, setAllergies] = useState(
    (customer?.preferences?.allergies ?? []).join(", "),
  );
  const [preferredTableNotes, setPreferredTableNotes] = useState(
    customer?.preferences?.preferredTableNotes ?? "",
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 2 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      toast.error("Le prénom et le nom sont requis.");
      return;
    }
    setSaving(true);
    try {
      await updateCustomer(customer.id, {
        firstName,
        lastName,
        phone,
        image,
        preferences: {
          isVegetarian,
          isGlutenFree,
          allergies: allergies
            ? allergies.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
          preferredTableNotes: preferredTableNotes.trim() || undefined,
        },
      });
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Photo de profil"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div>
            <p className="text-lg font-semibold">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Camera className="h-3.5 w-3.5" /> Cliquez sur la photo pour la
              changer
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Préférences alimentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Végétarien(ne)</span>
              <Switch checked={isVegetarian} onCheckedChange={setIsVegetarian} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Sans gluten</span>
              <Switch checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pref-allergies">Allergies (séparées par des virgules)</Label>
            <Input
              id="pref-allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="ex. arachides, lactose"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pref-notes">Note pour votre table</Label>
            <Textarea
              id="pref-notes"
              rows={2}
              value={preferredTableNotes}
              onChange={(e) => setPreferredTableNotes(e.target.value)}
              placeholder="ex. près de la fenêtre"
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