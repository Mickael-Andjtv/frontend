import { AppSidebar } from "@/components/layout/app-sidebar";
import NavBar from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
