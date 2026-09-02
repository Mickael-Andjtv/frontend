"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { NotificationPanel } from "../admin/notification-panel";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-10 w-full shrink-0 items-center justify-between px-6 bg-gray-200">
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <NotificationPanel />
      </div>
    </header>
  );
};

export default NavBar;
