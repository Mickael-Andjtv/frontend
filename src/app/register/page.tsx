"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UtensilsCrossed, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/client";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [preferredTableNotes, setPreferredTableNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
        preferences: {
          isVegetarian,
          isGlutenFree,
          allergies: allergies
            ? allergies.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
          preferredTableNotes: preferredTableNotes.trim() || undefined,
        },
      });
      toast.success("Compte créé. Bienvenue !");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold">La Table d&apos;Or</h1>
          <p className="text-sm text-muted-foreground">
            Créez votre compte en quelques secondes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
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
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+261 34 ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium">Préférences alimentaires (optionnel)</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">Végétarien(ne)</span>
                    <Switch checked={isVegetarian} onCheckedChange={setIsVegetarian} />
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">Sans gluten</span>
                    <Switch checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
                  </label>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (séparées par des virgules)</Label>
                    <Input
                      id="allergies"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="ex. arachides, lactose"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="table-notes">Note pour votre table</Label>
                    <Input
                      id="table-notes"
                      value={preferredTableNotes}
                      onChange={(e) => setPreferredTableNotes(e.target.value)}
                      placeholder="ex. près de la fenêtre"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Créer mon compte
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-medium text-primary hover:underline"
              >
                Se connecter
              </Link>
            </p>
            <div className="mt-3 text-center">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:underline"
              >
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}