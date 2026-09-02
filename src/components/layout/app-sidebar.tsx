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
  LayoutDashboard,
  SquareDot,
  CalendarDays,
  Receipt,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const items = [
  { title: "Tableau de bord", url: "/inventory/dashboard", icon: LayoutDashboard },
  { title: "Table", url: "/restaurant-table", icon: SquareDot },
  { title: "Réservation", url: "/reservation", icon: CalendarDays },
  { title: "Commande", url: "/order", icon: Receipt },
  { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  { title: "Client", url: "/admin/customers", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="relative h-full w-full px-1 group-data-[collapsible=icon]:hidden">
          <Logo />
        </div>

        <div className="relative mx-auto hidden size-8 group-data-[collapsible=icon]:block">
          <Logo variant="icon" className="size-8 gap-0 [&>span:first-child]:size-8 [&_svg]:size-4" />
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
                        isActive && "bg-gray-300 font-semibold text-primary"
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