"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ShoppingBag,
  Leaf,
  WheatOff,
  ChefHat,
  Timer,
  ShieldCheck,
  CalendarDays as CalendarIcon,
  Sparkles,
  Play,
  UtensilsCrossed,
  Send,
  MessageCircle,
  Share2,
  MapPin,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import { LandingNavbar } from "@/features/landing/landing-navbar";
import { Reveal } from "@/features/landing/reveal";
import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMenuItems } from "@/services/menu";
import { getCategories } from "@/services/categories";
import type { MenuItem } from "@/features/menu/types/menu.types";
import { cn } from "@/lib/utils";

const currency = (value: number) => `${value.toLocaleString("fr-FR")} Ar`;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80";
const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";
const EXPERIENCE_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [authOpen, setAuthOpen] = useState(false);
  const [authNext, setAuthNext] = useState("/client");
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getMenuItems(), getCategories()])
      .then(([menuItems, cats]) => {
        if (!active) return;
        setItems(menuItems.filter((i) => i.status === "AVAILABLE"));
        setCategories(cats);
      })
      .finally(() => active && setMenuLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const requireAuth = (next: string) => {
    if (isAuthenticated) {
      window.location.href = next;
      return;
    }
    setAuthNext(next);
    setAuthOpen(true);
  };

  const featured = items.filter((i) =>
    ["item-5", "item-8", "item-7", "item-9", "item-12", "item-13"].includes(i.id),
  );

  const filteredMenu =
    selectedCategory === "ALL"
      ? items
      : items.filter((i) => i.categoryId === selectedCategory);

  const whyUs = [
    { icon: Leaf, title: "Produits frais", desc: "Ingrédients locaux sélectionnés chaque matin." },
    { icon: Timer, title: "Service rapide", desc: "Vos plats préparés sur commande en quelques minutes." },
    { icon: ChefHat, title: "Chefs passionnés", desc: "Une cuisine soignée par des chefs passionnés." },
    { icon: CalendarIcon, title: "Réservation facile", desc: "Réservez votre table en quelques secondes." },
    { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Réglez en espèces, par carte ou Mobile Money." },
    { icon: Sparkles, title: "Expérience unique", desc: "Une ambiance chaleureuse et élégante." },
  ];

  const faqs = [
    {
      q: "Comment réserver une table ?",
      a: "Connectez-vous puis rendez-vous dans « Mes réservations », choisissez la date, l'heure et le nombre de personnes, puis confirmez. Vous recevrez une confirmation dès que votre réservation sera acceptée.",
    },
    {
      q: "Puis-je annuler ma réservation ?",
      a: "Oui. Vous pouvez annuler votre réservation tant qu'elle n'est pas terminée. Certaines conditions peuvent s'appliquer pour les réservations de groupe.",
    },
    {
      q: "Comment commander ?",
      a: "Parcourez notre menu, ajoutez vos plats au panier, choisissez votre table ou le type de commande, puis validez. Un QR Code vous sera fourni après la commande.",
    },
    {
      q: "Quels moyens de paiement sont acceptés ?",
      a: "Nous acceptons les espèces, la carte bancaire et le Mobile Money.",
    },
    {
      q: "Puis-je modifier ma commande ?",
      a: "Tant que votre commande n'a pas commencé à être préparée, notre équipe peut vous accompagner pour toute modification. Contactez-nous directement.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      {/* ============ HERO ============ */}
      <section id="accueil" className="relative flex min-h-screen items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex animate-in fade-in slide-in-from-bottom-4 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Cuisine moderne & raffinée
            </span>
            <h1 className="mt-6 animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Une expérience culinaire qui mérite votre attention
            </h1>
            <p className="mt-5 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg text-white/80">
              Des plats d&apos;inspiration locale préparés avec passion, dans
              une ambiance chaleureuse. Réservez votre table ou commandez en
              quelques clics.
            </p>
            <div className="mt-8 flex animate-in fade-in slide-in-from-bottom-4 flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => requireAuth("/client/reservations")}
                className="gap-2"
              >
                <CalendarDays className="h-4 w-4" /> Réserver une table
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={() => requireAuth("/client/menu")}
              >
                <ShoppingBag className="h-4 w-4" /> Commander maintenant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="a-propos" className="bg-muted/40 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal direction="left" className="relative">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_IMAGE}
                alt="Notre restaurant"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border bg-background p-5 shadow-lg sm:block">
              <p className="text-3xl font-bold text-primary">12+</p>
              <p className="text-sm text-muted-foreground">
                années d&apos;expérience
              </p>
            </div>
          </Reveal>
          <Reveal direction="right">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              À propos
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              La Table d&apos;Or, le goût de l&apos;authentique
            </h2>
            <p className="mt-5 text-muted-foreground">
              Niché au cœur de la ville, La Table d&apos;Or offre une expérience
              culinaire moderne. Notre philosophie : des produits frais, des
              recettes généreuses et un service attentionné.
            </p>
            <p className="mt-3 text-muted-foreground">
              De l&apos;entrée au dessert, chaque plat est pensé pour éveiller
              vos sens dans une ambiance élégante et conviviale.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: ChefHat, text: "Chefs passionnés" },
                { icon: Leaf, text: "Produits frais" },
                { icon: Star, text: "Noté 4,8/5" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-2 rounded-xl border bg-background p-4 text-center"
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SPECIAL DISHES ============ */}
      {featured.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nos incontournables
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Les plats à la une
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {item.imageUrl?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl[0]}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground/40">
                          <UtensilsCrossed className="h-10 w-10" />
                        </div>
                      )}
                      <Badge className="absolute left-3 top-3 gap-1 bg-primary">
                        <Star className="h-3 w-3 fill-current" /> Populaire
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="font-bold text-primary">
                          {currency(item.price)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-2">
                        {item.isVegetarian && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Leaf className="h-3 w-3" /> Végé
                          </Badge>
                        )}
                        {item.isGlutenFree && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <WheatOff className="h-3 w-3" /> Sans gluten
                          </Badge>
                        )}
                      </div>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => {
                          addItem(item);
                          openCart();
                        }}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ WHY US ============ */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pourquoi nous choisir
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Une expérience pensée pour vous
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div className="flex h-full flex-col items-start gap-4 rounded-2xl border bg-background p-6 transition hover:shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MENU PREVIEW ============ */}
      <section id="menu" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Notre carte
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Découvrez nos menus
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  selectedCategory === "ALL"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                Tous
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </Reveal>

          {menuLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMenu.slice(0, 8).map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {item.imageUrl?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl[0]}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground/40">
                        <UtensilsCrossed className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-sm font-bold text-primary">
                        {currency(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => requireAuth("/client/menu")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/80"
                      aria-label="Commander"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <ButtonLink href="/client/menu" size="lg" className="gap-2">
              Voir le menu complet <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section id="experience" className="relative overflow-hidden py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${EXPERIENCE_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
              <Play className="h-8 w-8 fill-current" />
            </span>
            <h2 className="mt-8 text-3xl font-bold text-white sm:text-4xl">
              L&apos;expérience La Table d&apos;Or
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Un cadre élégant, une ambiance chaleureuse et une cuisine qui
              ravira vos papilles. Vivez un moment inoubliable.
            </p>
            <Button
              size="lg"
              className="mt-8 gap-2"
              onClick={() => requireAuth("/client/reservations")}
            >
              <CalendarDays className="h-4 w-4" /> Réserver votre table
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="bg-muted/40 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Questions fréquentes
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <Accordion defaultValue={[faqs[0]?.q].filter(Boolean) as string[]}>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={faq.q}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UtensilsCrossed className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold">La Table d&apos;Or</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Une expérience culinaire moderne et raffinée, au cœur de la
              ville.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram">
                <Send className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" aria-label="Facebook">
                <MessageCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" aria-label="Twitter">
                <Share2 className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#a-propos" className="hover:text-foreground">À propos</a></li>
              <li><a href="#menu" className="hover:text-foreground">Menu</a></li>
              <li><a href="#experience" className="hover:text-foreground">Expérience</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Espace client</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Inscription</Link></li>
              <li><Link href="/client" className="hover:text-foreground">Mon espace</Link></li>
              <li><Link href="/client/menu" className="hover:text-foreground">Commander</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Analakely, Antananarivo
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +261 34 00 000 00
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> contact@latabledor.mg
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} La Table d&apos;Or. Tous droits réservés.
        </div>
      </footer>

      {/* ============ AUTH PROMPT ============ */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">Bienvenue 👋</DialogTitle>
            <DialogDescription>
              Connectez-vous pour continuer, ou créez un compte en quelques
              secondes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <ButtonLink
              href={`/login?next=${encodeURIComponent(authNext)}`}
              size="lg"
              onClick={() => setAuthOpen(false)}
            >
              Se connecter
            </ButtonLink>
            <p className="text-center text-sm text-muted-foreground">
              Vous n&apos;avez pas encore de compte ?
            </p>
            <ButtonLink
              href={`/register?next=${encodeURIComponent(authNext)}`}
              size="lg"
              variant="outline"
              onClick={() => setAuthOpen(false)}
            >
              Créer un compte
            </ButtonLink>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}