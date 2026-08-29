"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Settings,
  MonitorCloud,
  FileUser,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const items = [
  { title: "Tableau de bord", url: "/inventory/dashboard", icon: MonitorCloud },
  { title: "Table", url: "/restaurant-table", icon: Package },
  { title: "Réservation", url: "/reservation", icon: ShoppingCart },
  { title: "Commande", url: "/inventory/settings", icon: Settings },
  { title: "Menu", url: "/inventory/clients", icon: FileUser },
  { title: "Client", url: "/inventory/settings", icon: Settings },

];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="relative h-full w-full group-data-[collapsible=icon]:hidden ">
          <Image
            src="/images/logo-full.svg"
            alt="logo"
            // fill
            width={200}
            height={0}
            className="object-contain object-left"
          />
        </div>

        <div className="relative h-8 w-8 hidden group-data-[collapsible=icon]:block mx-auto">
          <Image
            src="/images/logo-stock.svg"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-2">
        <SidebarGroup className="gap-8">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        "hover:bg-gray-200 transition-colors rounded-none",
                        isActive && "bg-gray-300 font-semibold text-primary",
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
