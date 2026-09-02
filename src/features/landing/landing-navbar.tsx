"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#a-propos", label: "À propos" },
  { href: "#menu", label: "Menu" },
  { href: "#experience", label: "Expérience" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNavbar() {
  const { isAuthenticated, customer, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials =
    customer?.firstName?.[0] && customer?.lastName?.[0]
      ? `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
      : "?";

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b bg-background/85 backdrop-blur"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#accueil" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            La Table d&apos;Or
          </span>
        </a>

        <nav
          className={cn(
            "hidden items-center gap-1 md:flex",
            !scrolled && "text-primary-foreground",
          )}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={cn("hidden items-center gap-2 md:flex", !scrolled && "text-primary-foreground")}>
          {isAuthenticated ? (
            <>
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border bg-primary px-2 py-1 text-primary-foreground"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                    {initials}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="invisible absolute right-0 mt-2 w-48 rounded-lg border bg-background p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 text-foreground">
                  <Link
                    href="/client"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Mon espace
                  </Link>
                  <Link
                    href="/client/orders"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Mes commandes
                  </Link>
                  <Link
                    href="/client/reservations"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Mes réservations
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </button>
                </div>
              </div>
              <ButtonLink href="/client/menu" variant="outline" className="border-primary text-primary">
                Commander
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                href="/login"
                variant="ghost"
                className={cn(
                  !scrolled ? "hover:bg-white/10 hover:text-white" : "",
                  "items-center gap-2"
                )}
              >
                <LogIn className="h-4 w-4" /> Connexion
              </ButtonLink>
              <ButtonLink href="/register" variant={scrolled ? "default" : "secondary"}>
                <UserPlus className="h-4 w-4" /> Inscription
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "md:hidden",
            !scrolled && "text-primary-foreground",
          )}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              {isAuthenticated ? (
                <>
                  <ButtonLink href="/client" variant="outline" onClick={() => setMobileOpen(false)}>
                    Mon espace
                  </ButtonLink>
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink href="/login" variant="outline" onClick={() => setMobileOpen(false)}>
                    Connexion
                  </ButtonLink>
                  <ButtonLink href="/register" onClick={() => setMobileOpen(false)}>
                    Inscription
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}