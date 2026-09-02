"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  UtensilsCrossed,
  LogOut,
  User as UserIcon,
  History,
  CalendarDays,
  Menu as MenuIcon,
  X,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/client/orders", label: "Mes commandes", icon: History },
  { href: "/client/reservations", label: "Mes réservations", icon: CalendarDays },
  { href: "/client/profile", label: "Profil", icon: UserIcon },
];

export function ClientNavbar() {
  const { customer, logout } = useAuth();
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    customer?.firstName?.[0] && customer?.lastName?.[0]
      ? `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
      : "?";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <ButtonLink
          href="/"
          variant="ghost"
          className="px-0 hover:bg-transparent items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            La Table d&apos;Or
          </span>
        </ButtonLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/client"
                ? pathname === "/client"
                : pathname.startsWith(link.href);
            return (
              <ButtonLink
                key={link.href}
                href={link.href}
                variant="ghost"
                className={cn("gap-2", active && "bg-muted")}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </ButtonLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <Badge className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1 text-xs">
                {count}
              </Badge>
            )}
            <span className="sr-only">Panier</span>
          </Button>

          <ButtonLink
            href="/client/profile"
            variant="ghost"
            className="hidden items-center gap-2 md:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </span>
            <span className="max-w-[140px] truncate text-sm">
              {customer?.firstName} {customer?.lastName}
            </span>
          </ButtonLink>

          <Button
            variant="ghost"
            className="hidden gap-2 md:flex"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <ButtonLink
                key={link.href}
                href={link.href}
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </ButtonLink>
            ))}
            <Button
              variant="ghost"
              className="justify-start gap-2 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}